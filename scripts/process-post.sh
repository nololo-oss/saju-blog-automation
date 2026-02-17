#!/bin/bash
# 블로그 포스트 처리 스크립트
# 사용법: ./process-post.sh <gemini_response_json> <date> <category>

set -e

BLOG_DIR="/home/nohhe/saju-blog"
POSTS_DIR="$BLOG_DIR/content/posts"
IMG_DIR="$BLOG_DIR/public/images/posts"
API_KEY=$(cat "$BLOG_DIR/scripts/.gemini-key" 2>/dev/null)

RESPONSE_FILE="$1"
CORRECT_DATE="$2"
CORRECT_CATEGORY="$3"

if [ -z "$RESPONSE_FILE" ] || [ -z "$CORRECT_DATE" ] || [ -z "$CORRECT_CATEGORY" ]; then
  echo '{"error": "사용법: process-post.sh <response_file> <date> <category>"}'
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo '{"error": "API 키 파일을 찾을 수 없습니다"}'
  exit 1
fi

mkdir -p "$IMG_DIR"

# 1. Gemini 응답에서 텍스트 추출
CONTENT=$(python3 -c "
import json, sys, re

with open('$RESPONSE_FILE', 'r') as f:
    data = json.load(f)

text = ''
if 'candidates' in data and data['candidates']:
    parts = data['candidates'][0].get('content', {}).get('parts', [])
    for p in parts:
        if 'text' in p:
            text += p['text']

# 코드블록 래핑 제거
text = re.sub(r'^\`\`\`(?:markdown|yaml|md)?\n', '', text, flags=re.IGNORECASE)
text = re.sub(r'\n\`\`\`$', '', text)
text = text.strip()

print(text)
")

if [ -z "$CONTENT" ]; then
  echo '{"error": "Gemini 응답에서 텍스트를 찾을 수 없습니다"}'
  exit 1
fi

# 2. 프론트매터 검증 + 날짜/카테고리 강제 교체 + 파일명 생성
RESULT=$(python3 -c "
import re, json, sys

content = '''$CONTENT'''

# 프론트매터 파싱
fm_match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
if not fm_match:
    # 앞뒤 공백/줄바꿈 제거 후 재시도
    content2 = content.strip()
    fm_match = re.match(r'^---\n(.*?)\n---\n(.*)', content2, re.DOTALL)
    if not fm_match:
        print(json.dumps({'error': '프론트매터를 찾을 수 없습니다', 'preview': content[:200]}))
        sys.exit(0)

frontmatter = fm_match.group(1)
body = fm_match.group(2).strip()

# 날짜 강제 교체
frontmatter = re.sub(r'date:\s*[\"\\'].*?[\"\\']', 'date: \"$CORRECT_DATE\"', frontmatter)

# 카테고리 강제 교체
frontmatter = re.sub(r'category:\s*[\"\\'].*?[\"\\']', 'category: \"$CORRECT_CATEGORY\"', frontmatter)

# 제목 추출
title_match = re.search(r'title:\s*[\"\\'](.+?)[\"\\']', frontmatter)
title = title_match.group(1) if title_match else 'untitled'

# 영문 슬러그 생성
import unicodedata
slug = title.lower()
# 한글 제거
slug = re.sub(r'[가-힣]+', '', slug)
# 특수문자 제거
slug = re.sub(r'[^a-z0-9\s-]', '', slug)
slug = re.sub(r'\s+', '-', slug).strip('-')
slug = re.sub(r'-+', '-', slug)[:50]

if not slug or len(slug) < 3:
    slug = '$CORRECT_CATEGORY-$CORRECT_DATE'

filename = f'$CORRECT_DATE-{slug}'

# h2 소제목 추출
h2_titles = re.findall(r'^## (.+)$', body, re.MULTILINE)

print(json.dumps({
    'frontmatter': frontmatter,
    'body': body,
    'filename': filename,
    'title': title,
    'h2Titles': h2_titles
}, ensure_ascii=False))
")

# 에러 체크
if echo "$RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(1 if 'error' in d else 0)" 2>/dev/null; then
  echo "$RESULT"
  exit 1
fi

FILENAME=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['filename'])")
TITLE=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['title'])")
FRONTMATTER=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['frontmatter'])")
BODY=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['body'])")

# 3. 이미지 3개 생성
generate_image() {
  local PROMPT="$1"
  local INDEX="$2"
  local IMG_FILE="$FILENAME-$INDEX"

  local RESPONSE=$(curl -s -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "
import json
print(json.dumps({
    'contents': [{'parts': [{'text': '''$PROMPT'''}]}],
    'generationConfig': {'responseModalities': ['TEXT', 'IMAGE']}
}))
")" --max-time 90)

  # base64 이미지 추출 및 저장
  python3 -c "
import json, base64, sys
try:
    data = json.loads('''$RESPONSE''')
    parts = data['candidates'][0]['content']['parts']
    for p in parts:
        if 'inlineData' in p:
            img_data = base64.b64decode(p['inlineData']['data'])
            mime = p['inlineData']['mimeType']
            ext = 'jpg' if 'jpeg' in mime else 'png'
            filepath = '$IMG_DIR/$IMG_FILE.' + ext
            with open(filepath, 'wb') as f:
                f.write(img_data)
            print(f'/images/posts/$IMG_FILE.{ext}')
            sys.exit(0)
    print('')
except Exception as e:
    print('', file=sys.stderr)
    print('')
" 2>/dev/null
}

# 이미지 프롬프트 생성
H2_1=$(echo "$RESULT" | python3 -c "import json,sys; t=json.load(sys.stdin)['h2Titles']; print(t[1] if len(t)>1 else '')" 2>/dev/null)
H2_2=$(echo "$RESULT" | python3 -c "import json,sys; t=json.load(sys.stdin)['h2Titles']; print(t[3] if len(t)>3 else (t[2] if len(t)>2 else ''))" 2>/dev/null)

STYLE="traditional Korean fortune telling, ink wash painting style, elegant, no text in image"

IMG1=$(generate_image "A beautiful blog thumbnail illustration about '$TITLE'. $STYLE. 16:9 aspect ratio." "1")
sleep 2
IMG2=$(generate_image "An illustration about '${H2_1:-$TITLE}' for Korean traditional wisdom blog. $STYLE." "2")
sleep 2
IMG3=$(generate_image "An illustration about '${H2_2:-$TITLE}' for Korean culture blog. $STYLE." "3")

# 4. 마크다운 파일 조립 + 저장
python3 -c "
import json, re, sys

frontmatter = '''$FRONTMATTER'''
body = '''$BODY'''
filename = '$FILENAME'
title = '''$TITLE'''
img1 = '$IMG1'
img2 = '$IMG2'
img3 = '$IMG3'

# 썸네일 추가
if img1:
    frontmatter += f'\nthumbnail: \"{img1}\"'

# 본문에 이미지 삽입
lines = body.split('\n')
h2_indices = [i for i, l in enumerate(lines) if l.startswith('## ')]

# 이미지 2: 2번째 ## 뒤
if img2 and len(h2_indices) >= 2:
    idx = h2_indices[1] + 1
    lines.insert(idx, '')
    lines.insert(idx + 1, f'![{title}]({img2})')
    lines.insert(idx + 2, '')
    for j in range(2, len(h2_indices)):
        h2_indices[j] += 3

# 이미지 3: 4번째 ## 뒤 (없으면 3번째)
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

# 이미지 파일 목록
img_files = []
import os
for img_path in [img1, img2, img3]:
    if img_path:
        local_path = '/home/nohhe/saju-blog/public' + img_path
        if os.path.exists(local_path):
            img_files.append('public' + img_path)

print(json.dumps({
    'filename': filename + '.md',
    'images': img_files,
    'status': 'saved'
}, ensure_ascii=False))
"
