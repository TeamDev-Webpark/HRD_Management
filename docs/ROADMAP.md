# HRD Management System — Incremental Development Roadmap

แนวทางการพัฒนา: **Incremental (ค่อยๆ เสียบทีละโมดูล)**
- ไม่สร้างเมนูเปล่าล่วงหน้า Sidebar จะแสดงเฉพาะเมนูที่พัฒนาและตรวจผ่านแล้ว
- แบ่งงานเป็น Step เล็กๆ (1–3 หน้าจอต่อ Step) พร้อม UI และ Interactive Mock Controls เพื่อให้ง่ายต่อการตรวจสอบ
- หยุดรอการยืนยันจากผู้ใช้หลังจบทุก Step

---

## Phase 0: Foundation & Shell (ฐานรากและโครงสร้างหลัก)
- [x] **0.1 Design System & UI Kit** — Color Palette, Typography, Reusable Components (`Button`, `Badge`, `Card`, `Input`, `Select`, `SearchBar`, `Table`, `Modal`, `EmptyState`) + หน้า UI Kit Preview
- [x] **0.2 Main Layout Shell** — Sidebar (ย่อ/ขยายได้) + Topbar (Title, Breadcrumb, Search, Notification, User Profile) เริ่มต้นที่เมนู `01 HRD Dashboard`
- [x] **0.3 HRM Mock Data & Role Switcher** — ข้อมูลจำลองพนักงาน/โครงสร้างองค์กรจาก HRM + ตัวสลับ Role ทดสอบ (`Admin` / `Manager` / `Employee`)

## Phase 1: Dashboard & Master Settings (ภาพรวมและตั้งค่าพื้นฐาน)
- [x] **1.1 Module 01 – HRD Dashboard (Part 1)** — KPI Cards 4 ใบหลัก (Total Employees, Training Completion, Training Hours, Training Budget)
- [x] **1.2 Module 01 – HRD Dashboard (Part 2)** — Performance, Skill Gap, IDP Progress, Talent Pool, Pending Approvals, Upcoming Training
- [x] **1.3 Module 10 – HRD Settings (Master)** — Categories, Course Types, Competency/Skill Levels, Scoring Criteria, Development Types, Certificate & Workflow Settings

## Phase 2: Training & Learning (ฝึกอบรมและเรียนรู้ออนไลน์)
- [x] **2.1 Module 03 – Training Planning** — Training Needs, Course Catalog, Annual Training Plan
- [x] **2.2 Module 03 – Training Resources** — Training Budget, Trainer & Provider
- [x] **2.3 Module 03 – Training Operations** — Training Session, Enrollment & Approval, Attendance, Training Results & History
- [x] **2.4 Module 04 – LMS Courses** — Online Courses, Lesson Management, Learning Materials
- [x] **2.5 Module 04 – LMS Assessment** — Question Bank, Online Assessment, Learning Progress, Certificate Management

## Phase 3: Performance Management (ประเมินผลการปฏิบัติงาน – PMS)
- [x] **3.1 Module 02 – Evaluation Setup** — Evaluation Cycle, Evaluation Template
- [x] **3.2 Module 02 – Goal & Check-in** — KPI / OKR / MBO, Progress Check-in
- [x] **3.3 Module 02 – Review & Calibration** — Self/Manager Review, 360° Feedback, Calibration & Final Rating, PIP Management

## Phase 4: Competency, IDP & Career Path (ทักษะ แผนพัฒนา และสายอาชีพ)
- [x] **4.1 Module 05 – Competency Framework** — Competency Dictionary, Position Competency, Competency Assessment
- [ ] **4.2 Module 05 – Skill Analytics** — Skill Matrix, Skill Gap Analysis, Skill Certification History
- [ ] **4.3 Module 06 – Individual Development Plan** — Employee IDP, Activities, Progress Tracking, Evaluation
- [ ] **4.4 Module 07 – Career Path** — Job Family, Career Path, Career Requirements, Employee Career Plan

## Phase 5: Talent, Succession & Reports (Talent ผู้สืบทอด และรายงาน)
- [ ] **5.1 Module 08 – Talent Management** — Talent Pool, Potential Assessment, 9-Box Grid, Talent Review
- [ ] **5.2 Module 08 – Succession Planning** — Key Positions, Successors, Readiness Assessment, Succession Plan
- [ ] **5.3 Module 09 – HRD Reports (Part 1)** — Performance, Training, Training History, Training Budget Reports
- [ ] **5.4 Module 09 – HRD Reports (Part 2)** — Skill Gap, IDP, Talent & Succession, Certificate Reports + Export UI

## Phase 6: Security, Self-Service & HRM Views (สิทธิ์การใช้งาน และบริการตนเอง)
- [ ] **6.1 Module 10 – Role & Permission** — Dynamic Roles CRUD, Copy/Toggle Role, Permission Matrix 6 Actions, User Mapping, Audit Log & Security Rules
- [ ] **6.2 Employee Self-Service (ESS)** — 8 เมนูพนักงาน
- [ ] **6.3 Manager Self-Service (MSS)** — 7 เมนูหัวหน้างาน
- [ ] **6.4 HRM Shared Views & Final Polish** — หน้าดูข้อมูลอ้างอิง HRM + ตรวจเช็ก Responsive & Consistency ทั้งระบบ
