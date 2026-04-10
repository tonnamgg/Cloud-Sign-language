# Sign Language Game

เว็บแอปเกมฝึกภาษามือด้วย React + FastAPI + AI Sign Detection

## ภาพรวม

โปรเจกต์นี้เป็นเกมฝึกภาษามือที่ใช้กล้องเว็บแคมเพื่ออ่านท่าทางผู้เล่นแบบเรียลไทม์ ประกอบด้วย:

- **Frontend** — React 19 + TypeScript + Vite + Tailwind CSS
- **Backend** — FastAPI + AI model (SiglipForImageClassification)
- หน้า Home, Game (กล้อง + โจทย์ + จับเวลา), Leaderboard

หมายเหตุ: ตอนนี้ Backend ใช้ in-memory mock data (ไม่มี database) เหมาะสำหรับพัฒนาและเดโม

## Tech Stack

### Frontend
- React 19 / TypeScript / Vite
- Tailwind CSS 4
- Lucide React

### Backend
- FastAPI + Uvicorn
- Transformers (HuggingFace) + PyTorch
- Pillow

## โครงสร้างหลัก

```text
sign-language-game/
  frontend/
    src/
      App.tsx
      main.tsx
      index.css
      App.css
      assets/
    index.html
    package.json
    vite.config.ts
  backend/
    main.py
    requirements.txt
    app/
      api/
        auth.py        # mock auth (dev-user)
        game.py        # game start/submit/detect
        leaderboard.py # in-memory mock leaderboard
        user.py        # in-memory mock users
      ai/
        model.py       # AI sign language detection
      core/
        game.py        # game logic
        scoring.py     # score calculation
        word.py        # random word generator
      db/              # (ยังไม่ใช้ — เตรียมไว้สำหรับ DB จริง)
        database.py
        models.py
      schema/
        user_schema.py
      utils/
        timer.py
```

## เริ่มต้นใช้งาน

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install fastapi uvicorn transformers torch torchvision Pillow
uvicorn main:app --reload
```

Backend รันที่ `http://localhost:8000` — ดู API docs ที่ `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend รันที่ `http://localhost:5173`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/game/start` | เริ่มเกมใหม่ |
| POST | `/game/submit` | ส่งรูปเพื่อตรวจคำตอบ |
| POST | `/game/detect` | ตรวจจับท่ามือ (ไม่เปลี่ยน state) |
| POST | `/user/me` | สร้าง/ดึงข้อมูลผู้ใช้ |
| POST | `/leaderboard/score` | บันทึกคะแนน |
| GET | `/leaderboard/leaderboard` | ดู leaderboard (top 10) |

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
