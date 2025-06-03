# SKM파트너스 웹사이트

건물 관리 및 부동산 서비스 전문 기업 SKM파트너스의 공식 웹사이트입니다.

## 주요 기능

- 🏢 건물 관리 서비스 소개
- 🏠 부동산 매물 관리
- 💬 실시간 문의 시스템 (디스코드 알림)
- 📧 이메일 자동 발송
- 👨‍💼 관리자 대시보드
- 📱 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Email**: Resend
- **Notifications**: Discord Webhooks
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone <repository-url>
cd skm-partners
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정
`.env.example` 파일을 `.env.local`로 복사하고 실제 값으로 수정:

\`\`\`bash
cp .env.example .env.local
\`\`\`

필수 환경 변수:
- `DATABASE_URL`: PostgreSQL 데이터베이스 URL
- `RESEND_API_KEY`: Resend 이메일 서비스 API 키
- `DISCORD_WEBHOOK_URL`: 디스코드 웹훅 URL
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`: 관리자 계정 정보

### 4. 데이터베이스 설정
\`\`\`bash
npm run db:migrate
\`\`\`

### 5. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

## 배포

### Vercel 배포
1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포

### 환경 변수 설정 (Vercel)
- `DATABASE_URL`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `ADMIN_EMAIL`
- `DISCORD_WEBHOOK_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 디스코드 웹훅 설정

1. 디스코드 서버에서 웹훅 생성
2. 웹훅 URL을 `DISCORD_WEBHOOK_URL` 환경 변수에 설정
3. 문의가 들어오면 자동으로 디스코드 알림 발송

## 관리자 기능

- `/admin/login`: 관리자 로그인
- `/admin/dashboard`: 대시보드
- `/admin/inquiries`: 문의 관리
- `/admin/real-estate`: 부동산 매물 관리
- `/admin/company`: 회사 정보 관리

## API 엔드포인트

- `POST /api/inquiries`: 문의 접수
- `GET /api/inquiries`: 문의 목록 조회
- `POST /api/properties`: 매물 등록
- `GET /api/properties`: 매물 목록 조회

## 보안

- JWT 기반 관리자 인증
- 입력 데이터 검증
- SQL 인젝션 방지
- XSS 방지

## 라이센스

Private - SKM파트너스 전용
