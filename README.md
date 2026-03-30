# Sign Language Game

เว็บแอปเกมฝึกภาษามือด้วย React + TypeScript + Vite

## ภาพรวม

โปรเจกต์นี้เป็นเกมฝึกภาษามือที่ใช้กล้องเว็บแคมเพื่ออ่านท่าทางผู้เล่นแบบเรียลไทม์ พร้อม UI สำหรับ:

- หน้า Home
- หน้า Game (กล้อง + โจทย์ + จับเวลา)
- หน้า Leaderboard

หมายเหตุ: ตอนนี้โค้ดยังเป็น Frontend-centric และมี mock data อยู่ในแอป เหมาะสำหรับพัฒนาและเดโมก่อนเชื่อม Backend จริง

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React

## โครงสร้างหลัก

```text
sign-language-game/
  public/
  src/
    App.tsx
    main.tsx
    index.css
    App.css
    assets/
  index.html
  package.json
  vite.config.ts
```

## เริ่มต้นใช้งาน

### 1) ติดตั้ง dependencies

```bash
npm install
```

### 2) รันโหมดพัฒนา

```bash
npm run dev
```

หลังรันสำเร็จ เปิด URL ที่ Vite แสดงใน terminal (ปกติ `http://localhost:5173`)

### 3) Build สำหรับ production

```bash
npm run build
```

### 4) Preview ไฟล์ build

```bash
npm run preview
```

## Scripts ที่ใช้บ่อย

- `npm run dev` : รัน development server
- `npm run build` : ตรวจ TypeScript และ build production
- `npm run preview` : preview ไฟล์จาก `dist`
- `npm run lint` : ตรวจ lint

## Backend Ready (แนวทางแนะนำ)

ตอนนี้ใน `src/App.tsx` มี logic เรียก AI และข้อมูล mock อยู่ในไฟล์เดียวกัน
เพื่อเตรียมพร้อมต่อ backend ควรแยกเป็นชั้นดังนี้:

1. `src/types.ts`
2. `src/api.ts`
3. `src/App.tsx` ให้เรียกผ่านฟังก์ชันจาก `api.ts`

ตัวอย่างรูปแบบ endpoint ที่แนะนำ:

- `GET /api/prompts`
- `GET /api/leaderboard`
- `POST /api/score`
- `POST /api/gesture/validate`

และแนะนำให้ใช้ environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080
```

จากนั้นเรียกผ่าน `import.meta.env.VITE_API_BASE_URL`

## Docker (ไม่บังคับ แต่แนะนำ)

ถ้าต้องการให้ทีมอื่นรันได้ง่ายและ environment ตรงกัน ควรทำ Docker โดยเฉพาะตอนเริ่มมี Backend

- ตอนนี้ (frontend only): ใช้ Node + npm install + npm run dev ได้เลย
- ตอนมี backend: ใช้ `docker-compose` เพื่อรัน frontend + backend พร้อมกัน

## ปัญหาที่พบบ่อย

1. กล้องไม่ขึ้น:
- ตรวจว่า browser อนุญาตสิทธิ์กล้องแล้ว
- ทดสอบบน `localhost` หรือ HTTPS

2. รัน `npm run dev` ไม่ได้:
- ลองลบ `node_modules` และ `package-lock.json` แล้วติดตั้งใหม่
- ใช้ Node.js เวอร์ชัน LTS ล่าสุด

3. Build fail เพราะ TypeScript:
- รัน `npm run build` เพื่อดู error แบบครบ
- แก้ type และ import ให้ถูกต้องก่อน deploy

## แนวทางพัฒนาต่อ

- แยก service layer สำหรับ API
- เพิ่ม error boundary และ loading states ในทุกหน้า
- เพิ่มระบบ login และผูกคะแนนกับผู้ใช้จริง
- เขียน test (unit + integration)
