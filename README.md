# Sign Language Game

เว็บแอปเกมฝึกภาษามือด้วย React + FastAPI + AWS Cognito

## ภาพรวม

โปรเจกต์นี้เป็นเกมฝึกภาษามือ ASL (American Sign Language) ที่ใช้กล้องเว็บแคมอ่านท่าทางผู้เล่นแบบเรียลไทม์ ผู้ใช้ต้อง login ผ่าน AWS Cognito ก่อนเข้าใช้งาน

- **Frontend** — React 19 + TypeScript + Vite + Tailwind CSS + AWS Amplify UI
- **Backend** — FastAPI + JWT verification ผ่าน Cognito JWKS
- หน้า Home, Game (กล้อง + โจทย์ + จับเวลา), Leaderboard

> **หมายเหตุ:** Backend ปัจจุบันใช้ mock data (RDS ยังไม่ได้เชื่อมต่อ)

## Tech Stack

### Frontend
- React 19 / TypeScript / Vite
- Tailwind CSS 4
- Lucide React
- AWS Amplify v6 + `@aws-amplify/ui-react`

### Backend
- FastAPI + Uvicorn
- python-jose (JWT verification)
- AWS Cognito (User Pool)

## Authentication

โปรเจกต์ใช้ **AWS Cognito** สำหรับ authentication:
- Login / Create Account ผ่าน Cognito Hosted UI (Amplify `Authenticator` component)
- Backend ตรวจสอบ JWT token ทุก request ผ่าน Cognito JWKS endpoint
- Session log แสดงใน terminal ของ backend (login / logout / session check ทุก 30 วินาที)

## โครงสร้างหลัก

```text
sign-language-game/
  frontend/
    .env                  # ไม่ถูก push (ดู .env.example)
    .env.example          # template สำหรับตั้งค่า
    src/
      App.tsx             # main app + Authenticator
      main.tsx            # entry point
      aws-config.ts       # Amplify configure
  backend/
    .env                  # ไม่ถูก push
    .env.example          # template สำหรับตั้งค่า
    main.py
    requirements.txt
    app/
      api/
        auth.py           # JWT verify ผ่าน Cognito JWKS
        user.py           # /me, /login-log, /logout-log, /session-check
        leaderboard.py    # mock leaderboard
        game.py           # game endpoints
      core/
        game.py
        scoring.py
        word.py
      db/
        database.py
        models.py
```

## เริ่มต้นใช้งาน

### 1. ตั้งค่า Environment Variables

**Frontend** — สร้างไฟล์ `frontend/.env` จาก `frontend/.env.example`:
```env
VITE_COGNITO_REGION=ap-southeast-1
VITE_USER_POOL_ID=<your-user-pool-id>
VITE_APP_CLIENT_ID=<your-app-client-id>
```

**Backend** — สร้างไฟล์ `backend/.env` จาก `backend/.env.example`:
```env
COGNITO_REGION=ap-southeast-1
USER_POOL_ID=<your-user-pool-id>
APP_CLIENT_ID=<your-app-client-id>
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend รันที่ `http://localhost:8000` — API docs ที่ `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend รันที่ `http://localhost:5173`

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/user/me` | ดึงข้อมูล user ปัจจุบัน | Required |
| POST | `/user/login-log` | บันทึก login log ใน terminal | Required |
| POST | `/user/logout-log` | บันทึก logout log ใน terminal | Required |
| GET | `/user/session-check` | ตรวจสอบ session (ทุก 30s) | Required |
| GET | `/leaderboard/leaderboard` | ดู leaderboard | - |
| POST | `/leaderboard/score` | บันทึกคะแนน | Required |
| POST | `/game/start` | เริ่มเกมใหม่ | Required |
| POST | `/game/detect` | ตรวจจับท่ามือ | Required |

## Scripts ที่ใช้บ่อย (Frontend)

- `npm run dev` : รัน development server
- `npm run build` : ตรวจ TypeScript และ build production
- `npm run preview` : preview ไฟล์จาก `dist`
- `npm run lint` : ตรวจ lint

## ปัญหาที่พบบ่อย

1. กล้องไม่ขึ้น:
   - ตรวจว่า browser อนุญาตสิทธิ์กล้องแล้ว
   - ทดสอบบน `localhost` หรือ HTTPS

2. `No module named 'transformers'`:
   - ตรวจว่า activate venv ถูกตัว แล้ว `pip install transformers torch torchvision Pillow`

3. `No module named uvicorn`:
   - `pip install uvicorn fastapi`

4. Build fail เพราะ TypeScript:
   - รัน `npm run build` เพื่อดู error แบบครบ

## แนวทางพัฒนาต่อ

- เชื่อม Database จริง (SQLAlchemy models เตรียมไว้แล้วใน `db/`)
- เพิ่มระบบ login (AWS Cognito) และผูกคะแนนกับผู้ใช้จริง
- Docker / docker-compose สำหรับ deploy
- เขียน test (unit + integration)
