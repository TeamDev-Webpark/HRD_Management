export interface LessonArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface VideoCheckpoint {
  id: string;
  timeSec: number;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

export interface LessonChapter {
  id: string;
  title: string;
  durationMin: number;
  clauseRef: string;
  videoUrl?: string;
  videoCheckpoints?: VideoCheckpoint[];
  objectives: string[];
  articles: LessonArticleSection[];
  guidelines: string[];
  caseStudy: {
    scenario: string;
    goodPractice: string;
    badPractice: string;
  };
  takeaway: string;
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface CourseCurriculum {
  instructor: string;
  targetAudience: string;
  chapters: LessonChapter[];
  questions: QuizQuestion[];
}

export interface ElearningCourseCardItem {
  id: string;
  code: string;
  name: string;
  description: string;
  standardLabel: string;
  category: string;
  durationHours: number;
  validityMonths: number;
  curriculum: CourseCurriculum;
  myRecord?: {
    status: "planned" | "completed";
    completedDate?: string;
    expiryDate?: string;
    score?: number;
    passed?: boolean;
  };
}

export const INITIAL_ELEARNING_COURSES: ElearningCourseCardItem[] = [
  {
    id: "LMS-01",
    code: "LMS-AI-101",
    name: "Generative AI Essentials for Everyday Work",
    description:
      "หลักการเขียน Prompt แบบมืออาชีพ การใช้ AI ช่วยสรุปประชุม วิเคราะห์ข้อมูล และกรอบการใช้งาน AI อย่างปลอดภัยในองค์กร",
    standardLabel: "Digital & AI",
    category: "Digital & AI",
    durationHours: 2,
    validityMonths: 12,
    curriculum: {
      instructor: "ดร.ภาณุพงศ์ รัตนชัย (AI & Data Strategist)",
      targetAudience: "พนักงานทุกระดับ / หัวหน้างาน / ทีมปฏิบัติการ",
      chapters: [
        {
          id: "ai-ch-1",
          title: "บทที่ 1: โครงสร้าง Prompt ที่มีประสิทธิภาพ (Role – Context – Task – Format)",
          durationMin: 20,
          clauseRef: "Digital Skill Lv.2",
          videoCheckpoints: [
            {
              id: "cp-ai-1",
              timeSec: 10,
              question: "องค์ประกอบใดที่ช่วยให้ AI ตอบคำถามได้ตรงบริบทและรูปแบบที่องค์กรต้องการมากที่สุด?",
              choices: [
                "ระบุบทบาท (Role), บริบทงาน (Context), เป้าหมาย (Task) และรูปแบบผลลัพธ์ (Format)",
                "พิมพ์คำสั่งให้สั้นที่สุดเพียง 2–3 คำโดยไม่ระบุบริบท",
                "คัดลอกข้อมูลความลับลูกค้าทั้งหมดวางลงใน AI สาธารณะ",
              ],
              answerIndex: 0,
              explanation:
                "สูตร Role – Context – Task – Format ช่วยลดความกำกวมและได้คำตอบที่พร้อมนำไปปรับใช้งานจริงทันที",
            },
          ],
          objectives: [
            "ออกแบบ Prompt โครงสร้าง 4 ส่วนสำหรับงานเอกสาร รายงาน และอีเมลองค์กรได้",
            "ปรับแก้คำสั่งแบบต่อเนื่อง (Iterative Prompting) เพื่อให้ได้ผลลัพธ์แม่นยำ",
          ],
          articles: [
            {
              heading: "สูตร Prompt 4 ส่วนสำหรับพนักงานยุคดิจิทัล",
              paragraphs: [
                "การสั่งงาน AI ให้ได้ผลดีเหมือนการบรีฟงานผู้ช่วย ยิ่งระบุบทบาท กลุ่มผู้อ่าน และรูปแบบตาราง/หัวข้อชัดเจน ยิ่งประหยัดเวลาแก้ไข",
              ],
              bullets: [
                "Role: กำหนดบทบาท เช่น 'คุณคือ HRD Specialist'",
                "Context: ระบุสถานการณ์ กลุ่มเป้าหมาย และน้ำเสียงที่ต้องการ",
                "Task & Format: ระบุผลลัพธ์และรูปแบบที่ต้องการให้ชัดเจน",
              ],
            },
          ],
          guidelines: [
            "ตรวจสอบความถูกต้องของข้อเท็จจริงและตัวเลขทุกครั้งก่อนนำผลลัพธ์ AI ไปใช้ (Human-in-the-Loop)",
          ],
          caseStudy: {
            scenario: "พนักงานต้องการใช้ AI ช่วยร่างอีเมลแจ้งเลื่อนกำหนดอบรมให้ผู้บริหาร 50 ท่าน",
            goodPractice: "ระบุน้ำเสียงที่เป็นทางการ ประเด็นสำคัญ และตรวจทานชื่อ-วันที่จริงก่อนส่งทุกครั้ง",
            badPractice: "สั่ง AI สั้นๆ แล้วคัดลอกส่งทันทีโดยไม่อ่านตรวจทานรายละเอียด",
          },
          takeaway: "ข้าพเจ้าสามารถออกแบบ Prompt โครงสร้าง 4 ส่วนและตรวจทานผลลัพธ์ก่อนนำไปใช้งานจริงได้",
        },
        {
          id: "ai-ch-2",
          title: "บทที่ 2: แนวทางการใช้ AI อย่างปลอดภัยและคุ้มครองข้อมูลองค์กร",
          durationMin: 20,
          clauseRef: "AI Governance & PDPA",
          videoCheckpoints: [
            {
              id: "cp-ai-2",
              timeSec: 12,
              question: "ข้อมูลประเภทใดที่ห้ามป้อนเข้าสู่ระบบ Generative AI สาธารณะโดยเด็ดขาด?",
              choices: [
                "ข้อมูลส่วนบุคคลพนักงาน/ลูกค้า (PII) เลขบัตรประชาชน เงินเดือน และความลับทางการค้า",
                "หัวข้อระดมสมองทั่วไปที่ไม่ระบุชื่อบุคคลหรือตัวเลขจริง",
                "โครงร่างหัวข้อสไลด์นำเสนอมาตรฐาน",
              ],
              answerIndex: 0,
              explanation:
                "ข้อมูลส่วนบุคคลและความลับทางการค้าห้ามนำไปป้อนใน AI สาธารณะเพื่อป้องกันข้อมูลรั่วไหล",
            },
          ],
          objectives: [
            "แยกแยะข้อมูลที่อนุญาตและข้อมูลต้องห้ามก่อนนำไปใช้งานกับเครื่องมือ AI",
            "ใช้วิธี Anonymize (ตัด/แทนที่ข้อมูลระบุตัวตน) ได้อย่างถูกต้อง",
          ],
          articles: [
            {
              heading: "หลักความปลอดภัย 3 ข้อในการใช้ AI ในองค์กร",
              paragraphs: [
                "ใช้เฉพาะเครื่องมือ AI ที่องค์กรอนุมัติ หลีกเลี่ยงการวางข้อมูลความลับ และตรวจสอบข้อเท็จจริงก่อนเผยแพร่เสมอ",
              ],
            },
          ],
          guidelines: [
            "แทนที่ชื่อจริง รหัสพนักงาน และยอดเงินจริงด้วยข้อมูลสมมติก่อนขอให้ AI ช่วยจัดรูปแบบ",
          ],
          caseStudy: {
            scenario: "ฝ่าย HR ต้องการให้ AI ช่วยสรุปแนวโน้มข้อเสนอแนะจากแบบสำรวจความผูกพันพนักงาน",
            goodPractice: "ลบชื่อและรหัสพนักงานออกทั้งหมดก่อนส่งข้อความดิบให้ AI ช่วยจัดหมวดหมู่ประเด็น",
            badPractice: "อัปโหลดไฟล์ Excel ที่มีชื่อ-นามสกุลและเงินเดือนพนักงานเข้าเว็บ AI ฟรี",
          },
          takeaway:
            "ข้าพเจ้าตระหนักถึงนโยบาย AI Governance และจะไม่ป้อนข้อมูลความลับหรือข้อมูลส่วนบุคคลลงใน AI สาธารณะ",
        },
      ],
      questions: [
        {
          question: "1. หลัก Human-in-the-Loop ในการใช้ Generative AI หมายถึงข้อใด?",
          choices: [
            "มนุษย์ต้องตรวจสอบความถูกต้องและความเหมาะสมของผลลัพธ์จาก AI ก่อนนำไปใช้งานจริงเสมอ",
            "ปล่อยให้ AI ส่งอีเมลถึงลูกค้าอัตโนมัติโดยไม่ต้องมีคนตรวจ",
            "ห้ามใช้ AI กับงานเอกสารทุกชนิด",
          ],
          answerIndex: 0,
          explanation: "AI อาจสร้างข้อมูลคลาดเคลื่อน (Hallucination) จึงต้องมีมนุษย์ตรวจสอบความถูกต้องทุกครั้ง",
        },
        {
          question: "2. ก่อนนำข้อมูลแบบสำรวจพนักงานไปให้ AI ช่วยสรุปประเด็น ควรทำสิ่งใดก่อน?",
          choices: [
            "ตัดข้อมูลระบุตัวตน (ชื่อ รหัสพนักงาน อีเมล) ออกให้หมดก่อน (Anonymize)",
            "ส่งไฟล์ต้นฉบับที่มีเบอร์โทรและเงินเดือนเข้าไปด้วยเพื่อให้ AI เข้าใจมากขึ้น",
            "โพสต์ลงโซเชียลมีเดียเพื่อขอความเห็นเพิ่มเติม",
          ],
          answerIndex: 0,
          explanation: "การลบข้อมูลระบุตัวตนช่วยปกป้องข้อมูลส่วนบุคคลตามหลัก PDPA และนโยบายองค์กร",
        },
      ],
    },
  },
  {
    id: "LMS-02",
    code: "LMS-LDR-301",
    name: "Leadership & Coaching for First-Time Managers",
    description:
      "พัฒนาทักษะหัวหน้างานยุคใหม่ ทั้งการโค้ชชิ่งด้วย GROW Model การให้ Feedback เชิงสร้างสรรค์ และการวางแผนพัฒนาลูกทีม (IDP)",
    standardLabel: "Leadership",
    category: "Leadership",
    durationHours: 3,
    validityMonths: 24,
    curriculum: {
      instructor: "อ.นภาพร วัฒนสินธ์ (People First Consulting)",
      targetAudience: "หัวหน้างานใหม่ / Team Lead / Manager",
      chapters: [
        {
          id: "ldr-ch-1",
          title: "บทที่ 1: บทบาทหัวหน้างานยุคใหม่และกรอบการโค้ชชิ่ง GROW Model",
          durationMin: 25,
          clauseRef: "People Leadership Lv.3",
          videoCheckpoints: [
            {
              id: "cp-ldr-1",
              timeSec: 12,
              question: "ตัวอักษร 'R' ในกรอบการโค้ชชิ่ง GROW Model หมายถึงขั้นตอนใด?",
              choices: [
                "Reality — สำรวจสถานการณ์จริง ข้อเท็จจริง และอุปสรรคที่เกิดขึ้นในปัจจุบัน",
                "Report — สั่งให้พนักงานเขียนรายงานส่งทุกเย็น",
                "Replace — เปลี่ยนตัวพนักงานเมื่อทำงานไม่ทัน",
              ],
              answerIndex: 0,
              explanation:
                "GROW ย่อมาจาก Goal (เป้าหมาย) – Reality (สถานการณ์จริง) – Options (ทางเลือก) – Will/Way Forward (แผนลงมือทำ)",
            },
          ],
          objectives: [
            "แยกความแตกต่างระหว่างการสั่งงาน (Directing), การสอนงาน (Mentoring) และการโค้ชชิ่ง (Coaching)",
            "ตั้งคำถามปลายเปิดตามหลัก GROW Model เพื่อดึงศักยภาพของสมาชิกในทีมได้",
          ],
          articles: [
            {
              heading: "4 ขั้นตอนการโค้ชชิ่งด้วย GROW Model",
              paragraphs: [
                "หัวหน้างานที่มีประสิทธิผลไม่ได้เป็นคนแก้ปัญหาให้ลูกทีมทุกเรื่อง แต่ใช้คำถามที่ถูกต้องช่วยให้ทีมคิดวิเคราะห์และลงมือทำได้ด้วยตนเอง",
              ],
              bullets: [
                "Goal: เป้าหมายที่ต้องการบรรลุคืออะไร?",
                "Reality: ปัจจุบันเกิดอะไรขึ้นและมีอุปสรรคใดบ้าง?",
                "Options: มีแนวทางเลือกใดบ้างที่ทำได้?",
                "Will: จะเริ่มลงมือทำข้อไหนก่อนและเมื่อไหร่?",
              ],
            },
          ],
          guidelines: [
            "จัดประชุม 1-on-1 Check-in กับสมาชิกในทีมอย่างสม่ำเสมอเดือนละ 1–2 ครั้ง",
          ],
          caseStudy: {
            scenario: "ลูกทีมทำงานส่งล่าช้าติดต่อกัน 2 สัปดาห์และเริ่มมีอาการหมดไฟ",
            goodPractice: "นัดคุย 1-on-1 เพื่อรับฟังปัญหา ช่วยจัดลำดับความสำคัญงาน และร่วมกันวางแผนสนับสนุน",
            badPractice: "ตำหนิลูกทีมกลางห้องประชุมใหญ่เพื่อให้เกิดความเกรงกลัว",
          },
          takeaway: "ข้าพเจ้าเข้าใจการใช้ GROW Model และพร้อมนำไปประยุกต์ใช้ในการพูดคุย 1-on-1 กับทีม",
        },
        {
          id: "ldr-ch-2",
          title: "บทที่ 2: ศิลปะการให้ Feedback เชิงสร้างสรรค์ (SBI Framework) และเชื่อมโยง IDP",
          durationMin: 25,
          clauseRef: "PMS & IDP Alignment",
          videoCheckpoints: [
            {
              id: "cp-ldr-2",
              timeSec: 12,
              question: "หลัก SBI Framework สำหรับการให้ Feedback ที่มีประสิทธิภาพประกอบด้วยอะไรบ้าง?",
              choices: [
                "Situation (สถานการณ์) – Behavior (พฤติกรรมที่เห็นจริง) – Impact (ผลกระทบที่เกิดขึ้น)",
                "Score – Bonus – Increment",
                "Speed – Budget – Instruction",
              ],
              answerIndex: 0,
              explanation:
                "SBI ช่วยให้การให้ Feedback อิงจากข้อเท็จจริงและพฤติกรรม ไม่ตัดสินตัวบุคคล ทำให้ผู้รับเปิดใจพัฒนาตนเอง",
            },
          ],
          objectives: [
            "สื่อสาร Feedback เชิงบวกและเชิงพัฒนาได้ตรงประเด็นด้วยหลัก SBI",
            "เชื่อมโยงผลการประเมิน KPI/Competency ไปสู่แผนพัฒนารายบุคคล (IDP 70-20-10)",
          ],
          articles: [
            {
              heading: "การเปลี่ยน Feedback ให้เป็นแผนพัฒนา IDP (70-20-10)",
              paragraphs: [
                "หลังให้ Feedback ควรชวนพนักงานออกแบบกิจกรรมพัฒนาในสัดส่วน 70% เรียนรู้จากงานจริง, 20% โค้ชชิ่งจากหัวหน้า/เพื่อนร่วมงาน และ 10% อบรมหลักสูตร",
              ],
            },
          ],
          guidelines: ["ให้ Feedback ทันทีที่เหตุการณ์เกิดขึ้น ไม่รอสะสมไว้พูดตอนประเมินปลายปี"],
          caseStudy: {
            scenario: "พนักงานนำเสนองานต่อลูกค้าได้ดีมาก แต่ยังขาดการสรุปตัวเลขผลลัพธ์ที่ชัดเจน",
            goodPractice: "ชื่นชมจุดแข็งเรื่องการสื่อสาร แล้วแนะนำเพิ่มเติมเรื่องการใส่สรุป KPI ด้วยหลัก SBI",
            badPractice: "พูดรวมๆ ว่า 'พรีเซนต์ยังไม่ค่อยดีนะ ไปปรับปรุงมาใหม่'",
          },
          takeaway: "ข้าพเจ้าสามารถให้ Feedback ด้วยหลัก SBI และช่วยทีมวางแผน IDP ได้อย่างเป็นรูปธรรม",
        },
      ],
      questions: [
        {
          question: "1. โมเดล 70-20-10 ในการวางแผนพัฒนารายบุคคล (IDP) สัดส่วน 70% หมายถึงการพัฒนาในรูปแบบใด?",
          choices: [
            "การเรียนรู้จากการลงมือปฏิบัติงานจริงและรับมอบหมายโปรเจกต์ท้าทาย (On-the-Job Experience)",
            "การเข้าห้องเรียนอบรมและดูวิดีโอออนไลน์เพียงอย่างเดียว",
            "การอ่านหนังสือคู่มือด้วยตนเอง",
          ],
          answerIndex: 0,
          explanation: "70% คือ Experience (งานจริง), 20% คือ Social/Coaching, 10% คือ Formal Training",
        },
        {
          question: "2. ข้อใดคือตัวอย่างการให้ Feedback ตามหลัก SBI ที่ดีที่สุด?",
          choices: [
            "ในการประชุมลูกค้าเมื่อเช้า (S) คุณตอบคำถามเทคนิคได้กระชับชัดเจน (B) ทำให้ลูกค้ามั่นใจและอนุมัติแผนได้เร็วขึ้น (I)",
            "คุณเป็นคนเก่งมาก ทำดีแล้ว",
            "งานรอบนี้ยังไม่ผ่านเพราะคุณไม่รอบคอบเหมือนเดิม",
          ],
          answerIndex: 0,
          explanation: "ระบุสถานการณ์ พฤติกรรมที่สังเกตได้จริง และผลกระทบที่เกิดขึ้นชัดเจน ไม่ตัดสินเหมารวม",
        },
      ],
    },
  },
  {
    id: "LMS-03",
    code: "LMS-CMP-201",
    name: "PDPA & Information Security Compliance 2569",
    description:
      "หลักสูตรบังคับประจำปีว่าด้วยการคุ้มครองข้อมูลส่วนบุคคล การรับมือ Phishing Email และแนวทางปฏิบัติความปลอดภัยไซเบอร์ขององค์กร",
    standardLabel: "Compliance",
    category: "Compliance",
    durationHours: 1.5,
    validityMonths: 12,
    myRecord: {
      status: "completed",
      completedDate: "18 พ.ย. 2569",
      expiryDate: "18 พ.ย. 2570",
      score: 95,
      passed: true,
    },
    curriculum: {
      instructor: "คุณวรเมธ ศรีสวัสดิ์ (Information Security Lead)",
      targetAudience: "พนักงานทุกคนในองค์กร (Mandatory)",
      chapters: [
        {
          id: "pdpa-ch-1",
          title: "บทที่ 1: หลักการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ในการทำงานประจำวัน",
          durationMin: 20,
          clauseRef: "PDPA พ.ศ. 2562",
          videoCheckpoints: [
            {
              id: "cp-pdpa-1",
              timeSec: 10,
              question:
                "หากพบเหตุข้อมูลส่วนบุคคลรั่วไหลหรือส่งไฟล์ผิดผู้รับ ต้องแจ้งหน่วยงาน DPO/IT Security ภายในเมื่อใด?",
              choices: [
                "แจ้งทันที (เพื่อให้องค์กรประเมินและแจ้ง สคส. ภายใน 72 ชั่วโมง)",
                "รอแจ้งในการประชุมประจำไตรมาส",
                "ลบอีเมลฝั่งตัวเองทิ้งแล้วไม่ต้องแจ้งใคร",
              ],
              answerIndex: 0,
              explanation:
                "กฎหมาย PDPA กำหนดให้แจ้งเหตุละเมิดข้อมูลภายใน 72 ชั่วโมง พนักงานจึงต้องรายงานทันทีที่พบเหตุ",
            },
          ],
          objectives: [
            "จำแนกข้อมูลส่วนบุคคลทั่วไปและข้อมูลอ่อนไหว (Sensitive Data) ได้ถูกต้อง",
            "ปฏิบัติตามขั้นตอนเมื่อเกิดเหตุข้อมูลรั่วไหลได้อย่างรวดเร็ว",
          ],
          articles: [
            {
              heading: "ข้อควรปฏิบัติ PDPA ประจำวัน",
              paragraphs: [
                "เก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลเท่าที่จำเป็นตามวัตถุประสงค์เท่านั้น พร้อมตั้งรหัสผ่านไฟล์เอกสารก่อนส่งออกภายนอก",
              ],
            },
          ],
          guidelines: ["ล็อกหน้าจอคอมพิวเตอร์ (Win + L) ทุกครั้งเมื่อลุกจากโต๊ะทำงาน"],
          caseStudy: {
            scenario: "ได้รับอีเมลอ้างว่ามาจากฝ่าย IT แจ้งให้คลิกลิงก์เปลี่ยนรหัสผ่านด่วนภายใน 1 ชั่วโมง",
            goodPractice: "ตรวจสอบโดเมนผู้ส่งและโทรยืนยันกับ IT Helpdesk ก่อนคลิกลิงก์หรือกรอกรหัสผ่าน",
            badPractice: "รีบคลิกลิงก์และกรอกรหัสผ่านบัญชีบริษัททันที",
          },
          takeaway: "ข้าพเจ้าเข้าใจหลักการคุ้มครองข้อมูลส่วนบุคคลและพร้อมรายงานเหตุต้องสงสัยทันที",
        },
        {
          id: "pdpa-ch-2",
          title: "บทที่ 2: การสังเกต Phishing Email และการตั้งรหัสผ่านที่ปลอดภัย",
          durationMin: 20,
          clauseRef: "Security Awareness",
          videoCheckpoints: [
            {
              id: "cp-pdpa-2",
              timeSec: 12,
              question: "ข้อใดคือสัญญาณเตือนสำคัญของ Phishing Email?",
              choices: [
                "เร่งเร้าให้รีบคลิกลิงก์ด่วน ชื่อโดเมนผู้ส่งผิดเพี้ยน และขอให้กรอกรหัสผ่าน",
                "อีเมลแจ้งข่าวประชาสัมพันธ์ภายในจากโดเมนบริษัทที่ไม่มีลิงก์ขอรหัสผ่าน",
                "ปฏิทินนัดประชุมจากหัวหน้างานในระบบ Microsoft Teams",
              ],
              answerIndex: 0,
              explanation: "ผู้โจมตีมักสร้างความตื่นตระหนกและปลอมโดเมนให้คล้ายของจริงเพื่อหลอกขอรหัสผ่าน",
            },
          ],
          objectives: [
            "สังเกตจุดผิดปกติของ Phishing Email และรายงานผ่านปุ่ม Report Phishing ได้",
          ],
          articles: [
            {
              heading: "แนวทางป้องกันบัญชีถูกยึดครอง",
              paragraphs: [
                "เปิดใช้งาน 2FA / MFA เสมอ ไม่ใช้รหัสผ่านซ้ำกันหลายระบบ และไม่แชร์รหัสผ่านให้ผู้อื่น",
              ],
            },
          ],
          guidelines: ["เปิดใช้งาน Multi-Factor Authentication (MFA) บนทุกบัญชีงาน"],
          caseStudy: {
            scenario: "พบไฟล์แนบ .zip จากผู้ส่งไม่รู้จักอ้างว่าเป็นใบแจ้งหนี้ค้างชำระ",
            goodPractice: "ไม่เปิดไฟล์แนบ และกด Report Phishing ส่งให้ทีม IT Security ตรวจสอบ",
            badPractice: "ดาวน์โหลดและแตกไฟล์เพื่อเปิดดูรายละเอียด",
          },
          takeaway: "ข้าพเจ้าจะตรวจสอบผู้ส่งและไม่เปิดลิงก์หรือไฟล์แนบต้องสงสัยโดยเด็ดขาด",
        },
      ],
      questions: [
        {
          question: "1. เมื่อลุกออกจากโต๊ะทำงาน พนักงานควรทำสิ่งใดเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต?",
          choices: [
            "ล็อกหน้าจอคอมพิวเตอร์ (Win + L / Ctrl + Cmd + Q) ทุกครั้ง",
            "เปิดหน้าจอค้างไว้เพื่อให้เพื่อนร่วมงานช่วยดูเมลแทน",
            "จดรหัสผ่านแปะไว้ที่ขอบจอภาพ",
          ],
          answerIndex: 0,
          explanation: "การล็อกหน้าจอเป็นมาตรการพื้นฐานสำคัญในการป้องกันข้อมูลรั่วไหล",
        },
        {
          question: "2. หากเผลอส่งไฟล์ข้อมูลพนักงานผิดอีเมล ควรทำอย่างไรเป็นอันดับแรก?",
          choices: [
            "แจ้งหัวหน้างานและทีม DPO / IT Security ทันทีเพื่อดำเนินการแก้ไขและประเมินความเสี่ยง",
            "ปิดเงียบไว้เพราะกลัวถูกตำหนิ",
            "ส่งอีเมลซ้ำไปขอให้ผู้รับช่วยส่งต่อให้คนอื่น",
          ],
          answerIndex: 0,
          explanation: "การรายงานทันทีช่วยให้องค์กรจำกัดผลกระทบและปฏิบัติตามกรอบเวลา 72 ชั่วโมงของ PDPA ได้",
        },
      ],
    },
  },
  {
    id: "LMS-04",
    code: "LMS-DAT-204",
    name: "HR & Business Data Storytelling with Power BI",
    description:
      "การออกแบบแดชบอร์ด การเลือกกราฟให้เหมาะกับข้อมูล และการเล่าเรื่องด้วยตัวเลขเพื่อสนับสนุนการตัดสินใจของผู้บริหาร",
    standardLabel: "Data & Analytics",
    category: "Data & Analytics",
    durationHours: 2.5,
    validityMonths: 24,
    curriculum: {
      instructor: "ดร.ภาณุพงศ์ รัตนชัย (Data & AI Academy)",
      targetAudience: "HRBP / นักวิเคราะห์ข้อมูล / หัวหน้าแผนก",
      chapters: [
        {
          id: "dat-ch-1",
          title: "บทที่ 1: การเลือกกราฟให้ตอบโจทย์ธุรกิจและลดความรกของแดชบอร์ด",
          durationMin: 25,
          clauseRef: "Data Literacy Lv.3",
          videoCheckpoints: [
            {
              id: "cp-dat-1",
              timeSec: 12,
              question: "หากต้องการเปรียบเทียบแนวโน้มชั่วโมงอบรมรายเดือนตลอด 12 เดือน ควรเลือกใช้กราฟชนิดใด?",
              choices: [
                "กราฟแท่งหรือกราฟเส้น (Bar / Line Chart) เรียงตามเวลา",
                "กราฟวงกลม (Pie Chart) แบ่ง 12 ชิ้น",
                "ตารางข้อความล้วนไม่มีตัวเลขสรุป",
              ],
              answerIndex: 0,
              explanation: "Bar หรือ Line Chart ช่วยให้เห็นแนวโน้มขึ้น-ลงตามช่วงเวลาได้ชัดเจนกว่า Pie Chart",
            },
          ],
          objectives: [
            "เลือกชนิดกราฟที่สื่อสารประเด็นหลักได้ภายใน 5 วินาที",
            "กำหนดตัวชี้วัด KPI สำคัญและเส้นเป้าหมาย (Target Line) บนแดชบอร์ดได้",
          ],
          articles: [
            {
              heading: "หลักการออกแบบแดชบอร์ดเพื่อผู้บริหาร",
              paragraphs: [
                "แดชบอร์ดที่ดีต้องตอบคำถามสำคัญได้ทันที: ปัจจุบันอยู่ที่เท่าไหร่ เทียบเป้าเป็นอย่างไร และต้องลงมือทำอะไรต่อ",
              ],
            },
          ],
          guidelines: ["จำกัดจำนวนสีในแดชบอร์ดไม่เกิน 3–4 โทนสีหลักเพื่อความสะอาดตา"],
          caseStudy: {
            scenario: "แดชบอร์ด HRD เดิมมีกราฟ 14 ชิ้นอัดในหน้าเดียว ทำให้ผู้บริหารจับประเด็นไม่ได้",
            goodPractice: "คัดเฉพาะ 4 KPI หลักไว้ด้านบน และจัดกลุ่มกราฟวิเคราะห์เชิงลึกพร้อมตัวกรองแผนก",
            badPractice: "ใส่ทุกตารางและกราฟลงหน้าเดียวกันโดยไม่จัดลำดับความสำคัญ",
          },
          takeaway: "ข้าพเจ้าสามารถเลือกกราฟและจัดโครงสร้างแดชบอร์ดให้สื่อสารประเด็นสำคัญได้ชัดเจน",
        },
      ],
      questions: [
        {
          question: "1. ข้อใดคือจุดประสงค์หลักของ Data Storytelling ในงาน HRD และธุรกิจ?",
          choices: [
            "เปลี่ยนข้อมูลตัวเลขให้เป็นข้อค้นพบ (Insight) และข้อเสนอแนะที่นำไปตัดสินใจได้จริง",
            "ใส่กราฟและสีสันให้มากที่สุดเท่าที่จะทำได้",
            "แสดงข้อมูลดิบทั้งหมดทุกคอลัมน์บนสไลด์เดียว",
          ],
          answerIndex: 0,
          explanation: "Data Storytelling มุ่งเชื่อมโยงข้อมูลเข้ากับบริบทธุรกิจเพื่อให้เกิดการลงมือทำ (Actionable Insight)",
        },
      ],
    },
  },
  {
    id: "LMS-05",
    code: "LMS-PMS-102",
    name: "OKR & Goal Alignment Mastery",
    description:
      "เทคนิคการตั้งเป้าหมาย OKR และ KPI ที่วัดผลได้จริง เชื่อมโยงกลยุทธ์องค์กรสู่ระดับทีมและรายบุคคล พร้อมแนวทางทำ Progress Check-in",
    standardLabel: "Performance",
    category: "Performance",
    durationHours: 2,
    validityMonths: 12,
    curriculum: {
      instructor: "สถาบันพัฒนาผู้นำและองค์กร (TLD)",
      targetAudience: "หัวหน้างานและพนักงานทุกคนก่อนเริ่มรอบประเมิน",
      chapters: [
        {
          id: "pms-ch-1",
          title: "บทที่ 1: การเขียน Objective ที่สร้างแรงบันดาลใจและ Key Results ที่วัดผลได้",
          durationMin: 20,
          clauseRef: "PMS Framework",
          videoCheckpoints: [
            {
              id: "cp-pms-1",
              timeSec: 10,
              question: "Key Result (KR) ที่ดีควรมีลักษณะอย่างไร?",
              choices: [
                "วัดผลเป็นตัวเลขได้ชัดเจน เน้นผลลัพธ์ (Outcome) มากกว่าแค่งานที่ทำ (Output)",
                "เขียนกว้างๆ ไม่มีตัวเลขและไม่มีกำหนดเวลา",
                "ตั้งเป้าให้ง่ายที่สุดเพื่อจะได้ 100% ทุกข้อ",
              ],
              answerIndex: 0,
              explanation: "Key Result ต้องวัดผลเป็นตัวเลขเชิงผลลัพธ์ได้จริงเพื่อให้ติดตามความคืบหน้าได้โปร่งใส",
            },
          ],
          objectives: [
            "เขียน OKR ที่เชื่อมโยงกับเป้าหมายฝ่ายและองค์กรได้ภายใน 30 นาที",
            "ทำ Mid-Year Progress Check-in เพื่อปรับแผนงานได้ทันท่วงที",
          ],
          articles: [
            {
              heading: "ความแตกต่างระหว่าง Output และ Outcome",
              paragraphs: [
                "Output คือ 'จัดอบรมครบ 5 รุ่น' ส่วน Outcome คือ 'พนักงานที่เข้าอบรมมีคะแนนทักษะเพิ่มขึ้น ≥ 20% และลดข้อผิดพลาดงานได้ 30%'",
              ],
            },
          ],
          guidelines: ["ทบทวนความคืบหน้า OKR ร่วมกับหัวหน้างานอย่างน้อยไตรมาสละ 1 ครั้ง"],
          caseStudy: {
            scenario: "ทีมขายตั้ง KR ว่า 'โทรหาลูกค้าให้มากขึ้น' แต่สิ้นไตรมาสวัดผลไม่ได้",
            goodPractice: "ปรับเป็น 'เพิ่มอัตราการปิดการขายจากลูกค้าใหม่จาก 18% เป็น 25% ภายใน Q4'",
            badPractice: "คงเป้าหมายเดิมที่ไม่มีตัวเลขชี้วัดชัดเจน",
          },
          takeaway: "ข้าพเจ้าสามารถตั้งเป้าหมาย OKR/KPI ที่วัดผลเชิงผลลัพธ์และสอดคล้องกับทีมได้",
        },
      ],
      questions: [
        {
          question: "1. ข้อใดคือตัวอย่าง Key Result ที่วัดผลเชิงผลลัพธ์ (Outcome) ได้ดีที่สุด?",
          choices: [
            "ลดระยะเวลาการอนุมัติคำขอฝึกอบรมเฉลี่ยจาก 5 วันทำการ เหลือไม่เกิน 2 วันทำการ",
            "ทำงานให้เร็วขึ้นกว่าเดิม",
            "ประชุมทีมทุกเช้าวันจันทร์",
          ],
          answerIndex: 0,
          explanation: "มีค่าเริ่มต้น (5 วัน) เป้าหมายชัดเจน (≤ 2 วัน) และวัดผลเชิงผลลัพธ์ได้จริง",
        },
      ],
    },
  },
  {
    id: "LMS-06",
    code: "LMS-SFT-105",
    name: "Effective Cross-Functional Communication",
    description:
      "ทักษะการสื่อสารประสานงานข้ามแผนก การสรุปประเด็นแบบ Pyramid Principle และการจัดการความขัดแย้งเชิงสร้างสรรค์",
    standardLabel: "Soft Skills",
    category: "Soft Skills",
    durationHours: 1.5,
    validityMonths: 24,
    curriculum: {
      instructor: "อ.ปิยะวัฒน์ เกียรติสกุล (B2B Growth Partners)",
      targetAudience: "พนักงานทุกระดับที่ต้องประสานงานข้ามทีม",
      chapters: [
        {
          id: "sft-ch-1",
          title: "บทที่ 1: การสื่อสารแบบกระชับตรงประเด็นด้วย Pyramid Principle",
          durationMin: 20,
          clauseRef: "Core Competency Lv.2",
          videoCheckpoints: [
            {
              id: "cp-sft-1",
              timeSec: 10,
              question: "หลักการสำคัญของ Pyramid Principle ในการสื่อสารงานคือข้อใด?",
              choices: [
                "เริ่มจากข้อสรุปหรือประเด็นหลักก่อน แล้วค่อยขยายด้วยเหตุผลและข้อมูลสนับสนุน",
                "เล่าความเป็นมาตั้งแต่ต้นจนจบ แล้วค่อยบอกข้อสรุปในประโยคสุดท้าย",
                "ส่งข้อความยาวๆ โดยไม่แบ่งหัวข้อ",
              ],
              answerIndex: 0,
              explanation: "การนำเสนอข้อสรุปก่อน (Answer First) ช่วยให้ผู้ฟังจับประเด็นได้ทันทีและตัดสินใจได้เร็วขึ้น",
            },
          ],
          objectives: [
            "สรุปประเด็นการสื่อสารด้วยโครงสร้าง Answer First ได้ภายใน 1 นาที",
            "ลดความเข้าใจคลาดเคลื่อนในการส่งต่องานข้ามแผนก",
          ],
          articles: [
            {
              heading: "สื่อสารข้ามแผนกให้ราบรื่นด้วย 3 สิ่ง",
              paragraphs: [
                "ระบุเป้าหมายร่วมกันให้ชัด ตกลงผู้รับผิดชอบกับกำหนดส่งให้ตรงกัน และสรุปเป็นลายลักษณ์อักษรทุกครั้งหลังประชุม",
              ],
            },
          ],
          guidelines: ["สรุป Action Items พร้อมชื่อผู้รับผิดชอบและวันครบกำหนดหลังประชุมทุกครั้ง"],
          caseStudy: {
            scenario: "ฝ่ายการตลาดและฝ่ายวิศวกรรมเข้าใจขอบเขตงานไม่ตรงกันจนใกล้ถึงวันเปิดตัว",
            goodPractice: "จัดประชุมสั้น 15 นาทีทวนเป้าหมายร่วมกัน และสรุปขอบเขตงานลงเอกสารกลาง",
            badPractice: "ส่งอีเมลโต้เถียงกันไปมาโดยไม่ระบุสิ่งที่ต้องการให้ชัดเจน",
          },
          takeaway: "ข้าพเจ้าพร้อมนำหลัก Pyramid Principle มาใช้สื่อสารประสานงานข้ามแผนกให้ชัดเจนขึ้น",
        },
      ],
      questions: [
        {
          question: "1. การสื่อสารแบบ 'Answer First' ตามหลัก Pyramid Principle ช่วยเรื่องใดมากที่สุด?",
          choices: [
            "ช่วยให้ผู้รับสารเข้าใจข้อสรุปและสิ่งที่ต้องตัดสินใจได้ทันทีตั้งแต่ต้น",
            "ทำให้การประชุมยืดเยื้อมากขึ้น",
            "ลดความจำเป็นในการใช้ข้อมูลประกอบ",
          ],
          answerIndex: 0,
          explanation: "Answer First เปิดด้วยข้อสรุปหลักแล้วตามด้วยเหตุผลและข้อมูลสนับสนุน ทำให้สื่อสารกระชับและมีประสิทธิภาพ",
        },
      ],
    },
  },
];
