#!/bin/bash
# 블로그 포스트 처리 스크립트
# 사용법: ./process-post.sh <content_text_file> <date>
# content_text_file: Gemini가 생성한 마크다운 텍스트 (프론트매터 포함)
# date: YYYY-MM-DD (KST 기준)
# 카테고리는 Gemini가 frontmatter에 지정한 값을 검증하여 사용

set -e

BLOG_DIR="/home/nohhe/saju-blog"
POSTS_DIR="$BLOG_DIR/content/posts"
IMG_DIR="$BLOG_DIR/public/images/posts"
API_KEY=$(cat "$BLOG_DIR/scripts/.gemini-key" 2>/dev/null)

CONTENT_FILE="$1"
CORRECT_DATE="$2"

if [ -z "$CONTENT_FILE" ] || [ -z "$CORRECT_DATE" ]; then
  echo '{"error": "사용법: process-post.sh <content_file> <date>"}'
  exit 1
fi

if [ ! -f "$CONTENT_FILE" ]; then
  echo '{"error": "콘텐츠 파일을 찾을 수 없습니다"}'
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo '{"error": "API 키 파일을 찾을 수 없습니다"}'
  exit 1
fi

mkdir -p "$IMG_DIR"

# 1. 텍스트 파일에서 콘텐츠 읽기 + 코드블록 래핑 제거
CONTENT=$(python3 -c "
import re, sys
with open(sys.argv[1], 'r') as f:
    text = f.read()
text = re.sub(r'^\`\`\`(?:markdown|yaml|md)?\n', '', text, flags=re.IGNORECASE)
text = re.sub(r'\n\`\`\`\$', '', text)
text = text.strip()
# Gemini가 여는 --- 를 빠뜨린 경우 자동 추가
if not text.startswith('---') and re.match(r'^title:\s', text):
    text = '---\n' + text
print(text)
" "$CONTENT_FILE")

if [ -z "$CONTENT" ]; then
  echo '{"error": "텍스트 파일이 비어있습니다"}'
  exit 1
fi

# 2. 프론트매터 검증 + 날짜 강제 교체 + 카테고리 검증 + 파일명 생성
CONTENT_TEMP=$(mktemp)
echo "$CONTENT" > "$CONTENT_TEMP"

RESULT=$(python3 -c "
import re, json, sys

with open(sys.argv[1], 'r') as f:
    content = f.read()

correct_date = sys.argv[2]
VALID_CATEGORIES = ['saju', 'gwansang', 'dream', 'fengshui', 'gunghap', 'jakming', 'daily']

# 카테고리 한글→영문 매핑 (Gemini가 한글로 넣을 경우 대비)
CATEGORY_MAP = {
    '사주': 'saju', '관상': 'gwansang', '꿈해몽': 'dream', '해몽': 'dream',
    '풍수': 'fengshui', '궁합': 'gunghap', '작명': 'jakming',
    '오늘의운세': 'daily', '운세': 'daily'
}

fm_match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
if not fm_match:
    content2 = content.strip()
    fm_match = re.match(r'^---\n(.*?)\n---\n(.*)', content2, re.DOTALL)
    if not fm_match:
        print(json.dumps({'error': 'no frontmatter', 'preview': content[:200]}, ensure_ascii=False))
        sys.exit(0)

frontmatter = fm_match.group(1)
body = fm_match.group(2).strip()

# 날짜 강제 교체
frontmatter = re.sub(r'date:\s*[\"\\x27].*?[\"\\x27]', f'date: \"{correct_date}\"', frontmatter)

# 카테고리 검증 (Gemini가 넣은 값을 읽어서 유효한 slug인지 확인)
cat_match = re.search(r'category:\s*[\"\\x27](.+?)[\"\\x27]', frontmatter)
category = cat_match.group(1).strip() if cat_match else ''

# 유효한 slug가 아니면 매핑 시도
if category not in VALID_CATEGORIES:
    # 한글 매핑
    for k, v in CATEGORY_MAP.items():
        if k in category:
            category = v
            break
    else:
        # 영문 부분 매칭
        cat_lower = category.lower()
        for vc in VALID_CATEGORIES:
            if vc in cat_lower:
                category = vc
                break
        else:
            category = 'daily'  # 기본값

# 카테고리를 검증된 slug로 교체
frontmatter = re.sub(r'category:\s*[\"\\x27].*?[\"\\x27]', f'category: \"{category}\"', frontmatter)

title_match = re.search(r'title:\s*[\"\\x27](.+?)[\"\\x27]', frontmatter)
title = title_match.group(1) if title_match else 'untitled'

# 한글 키워드 → 영문 매핑 (슬러그용)
KEYWORD_MAP = {
    '사주': 'saju', '관상': 'gwansang', '꿈': 'dream', '해몽': 'dream',
    '풍수': 'fengshui', '궁합': 'gunghap', '작명': 'jakming',
    '운세': 'daily', '띠': 'zodiac', '별자리': 'star',
    '신년': 'newyear', '설날': 'seollal', '추석': 'chuseok',
    '연애': 'love', '결혼': 'marriage', '재물': 'wealth', '건강': 'health',
    '취업': 'career', '시험': 'exam', '이사': 'moving', '인연': 'fate',
    '토정비결': 'tojeong', '부적': 'bujeok', '타로': 'tarot',
    '오행': 'oheng', '음양': 'eumyang', '천간': 'cheongan', '지지': 'jiji',
    '십이지': 'twelve-zodiac', '사상체질': 'sasang',
    '병오': 'byeongoh', '말띠': 'horse', '호랑이': 'tiger',
    '용': 'dragon', '뱀': 'snake', '토끼': 'rabbit',
}

# 1) 영문 부분 추출
slug = title.lower()
eng_part = re.sub(r'[^a-z0-9\s-]', '', slug).strip()

# 2) 한글 키워드 매칭
kr_parts = []
for kr, en in KEYWORD_MAP.items():
    if kr in title and en not in kr_parts:
        kr_parts.append(en)

# 3) 슬러그 조합
if eng_part and len(re.sub(r'[\s-]', '', eng_part)) >= 3:
    slug = eng_part
elif kr_parts:
    slug = '-'.join(kr_parts[:4])
else:
    slug = category

slug = re.sub(r'\s+', '-', slug).strip('-')
slug = re.sub(r'-+', '-', slug)[:50]

# KST 시간(HHMM) 포함하여 하루 여러 포스팅 가능하도록
from datetime import datetime, timezone, timedelta
kst = datetime.now(timezone(timedelta(hours=9)))
time_suffix = kst.strftime('%H%M')
filename = f'{correct_date}-{time_suffix}-{slug}'
h2_titles = re.findall(r'^## (.+)\$', body, re.MULTILINE)

print(json.dumps({
    'frontmatter': frontmatter,
    'body': body,
    'filename': filename,
    'title': title,
    'category': category,
    'h2Titles': h2_titles
}, ensure_ascii=False))
" "$CONTENT_TEMP" "$CORRECT_DATE")

rm -f "$CONTENT_TEMP"

# 에러 체크
if echo "$RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if 'error' in d else 1)" 2>/dev/null; then
  echo "$RESULT"
  exit 1
fi

# RESULT를 임시 파일로 저장 (안전한 전달)
RESULT_FILE=$(mktemp)
echo "$RESULT" > "$RESULT_FILE"

FILENAME=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['filename'])" "$RESULT_FILE")
TITLE=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['title'])" "$RESULT_FILE")

# frontmatter와 body를 파일로 저장
FM_FILE=$(mktemp)
BODY_FILE=$(mktemp)
python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
with open(sys.argv[2], 'w') as f: f.write(d['frontmatter'])
with open(sys.argv[3], 'w') as f: f.write(d['body'])
" "$RESULT_FILE" "$FM_FILE" "$BODY_FILE"

# 이미지 프롬프트용 h2 제목 추출
H2_1=$(python3 -c "import json,sys; t=json.load(open(sys.argv[1]))['h2Titles']; print(t[1] if len(t)>1 else '')" "$RESULT_FILE" 2>/dev/null || echo "")
H2_2=$(python3 -c "import json,sys; t=json.load(open(sys.argv[1]))['h2Titles']; print(t[3] if len(t)>3 else (t[2] if len(t)>2 else ''))" "$RESULT_FILE" 2>/dev/null || echo "")

rm -f "$RESULT_FILE"

# 3. 이미지 3개 생성
generate_image() {
  local PROMPT="$1"
  local INDEX="$2"
  local IMG_FILE="$FILENAME-$INDEX"

  local PROMPT_FILE=$(mktemp)
  python3 -c "
import json, sys
print(json.dumps({
    'contents': [{'parts': [{'text': sys.argv[1]}]}],
    'generationConfig': {'responseModalities': ['TEXT', 'IMAGE']}
}))
" "$PROMPT" > "$PROMPT_FILE"

  local RESP_FILE=$(mktemp)
  curl -s -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d @"$PROMPT_FILE" \
    --max-time 90 \
    -o "$RESP_FILE" 2>/dev/null

  rm -f "$PROMPT_FILE"

  local IMG_RESULT=$(python3 -c "
import json, base64, sys
try:
    with open(sys.argv[1], 'r') as f:
        data = json.load(f)
    parts = data['candidates'][0]['content']['parts']
    for p in parts:
        if 'inlineData' in p:
            img_data = base64.b64decode(p['inlineData']['data'])
            mime = p['inlineData']['mimeType']
            ext = 'jpg' if 'jpeg' in mime else 'png'
            filepath = sys.argv[2] + '/' + sys.argv[3] + '.' + ext
            with open(filepath, 'wb') as f:
                f.write(img_data)
            print('/images/posts/' + sys.argv[3] + '.' + ext)
            sys.exit(0)
    print('')
except Exception as e:
    print('')
" "$RESP_FILE" "$IMG_DIR" "$IMG_FILE" 2>/dev/null)

  rm -f "$RESP_FILE"
  echo "$IMG_RESULT"
}

STYLE="traditional Korean fortune telling, ink wash painting style, elegant, no text in image"

IMG1=$(generate_image "A beautiful blog thumbnail illustration about '$TITLE'. $STYLE. 16:9 aspect ratio." "1")
sleep 2
IMG2=$(generate_image "An illustration about '${H2_1:-$TITLE}' for Korean traditional wisdom blog. $STYLE." "2")
sleep 2
IMG3=$(generate_image "An illustration about '${H2_2:-$TITLE}' for Korean culture blog. $STYLE." "3")

# 4. 마크다운 파일 조립 + 저장
python3 -c "
import json, os, sys

fm_file = sys.argv[1]
body_file = sys.argv[2]
filename = sys.argv[3]
title = sys.argv[4]
img1 = sys.argv[5]
img2 = sys.argv[6]
img3 = sys.argv[7]

with open(fm_file, 'r') as f:
    frontmatter = f.read().strip()
with open(body_file, 'r') as f:
    body = f.read().strip()

if img1:
    frontmatter += f'\nthumbnail: \"{img1}\"'

lines = body.split('\n')
h2_indices = [i for i, l in enumerate(lines) if l.startswith('## ')]

if img2 and len(h2_indices) >= 2:
    idx = h2_indices[1] + 1
    lines.insert(idx, '')
    lines.insert(idx + 1, f'![{title}]({img2})')
    lines.insert(idx + 2, '')
    for j in range(2, len(h2_indices)):
        h2_indices[j] += 3

target = 3 if len(h2_indices) >= 4 else (2 if len(h2_indices) >= 3 else -1)
if img3 and target >= 0:
    idx = h2_indices[target] + 1
    lines.insert(idx, '')
    lines.insert(idx + 1, f'![{title}]({img3})')
    lines.insert(idx + 2, '')

final_body = '\n'.join(lines)
final = f'---\n{frontmatter}\n---\n\n{final_body}'

filepath = f'/home/nohhe/saju-blog/content/posts/{filename}.md'
with open(filepath, 'w') as f:
    f.write(final)

img_files = []
for img_path in [img1, img2, img3]:
    if img_path:
        local_path = '/home/nohhe/saju-blog/public' + img_path
        if os.path.exists(local_path):
            img_files.append('public' + img_path)

# 자동 포스팅 카운터 기록
counter_file = f'/tmp/n8n-autopost-{sys.argv[8]}'
with open(counter_file, 'a') as cf:
    cf.write(filename + '\\n')

print(json.dumps({
    'filename': filename + '.md',
    'title': title,
    'images': img_files,
    'status': 'saved'
}, ensure_ascii=False))
" "$FM_FILE" "$BODY_FILE" "$FILENAME" "$TITLE" "$IMG1" "$IMG2" "$IMG3" "$CORRECT_DATE"

rm -f "$FM_FILE" "$BODY_FILE"
