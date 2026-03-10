"use client";
import { useState, useEffect } from "react";

// ===================== MASTER DATA =====================
const INITIAL_TEACHERS = ["山田 先生", "佐々木 先生", "田村 先生", "中村 先生"];

const EIKEN_LEVELS = ["2級", "準2級プラス", "準2級", "3級", "4級", "5級", "それ以外", "なし"];

const INITIAL_STUDENTS = [
  { id: 1, name: "田中 花子", grade: "中3", subjects: ["英語", "数学"], school: "○○中学校", targetSchool: "△△高校", club: "バスケットボール部", eiken: "3級" },
  { id: 2, name: "佐藤 健太", grade: "中2", subjects: ["数学", "理科"], school: "○○中学校", targetSchool: "", club: "サッカー部", eiken: "4級" },
  { id: 3, name: "山本 美咲", grade: "高1", subjects: ["英語", "国語"], school: "△△高校", targetSchool: "○○大学", club: "なし", eiken: "準2級" },
  { id: 4, name: "鈴木 拓海", grade: "中1", subjects: ["数学"], school: "○○中学校", targetSchool: "", club: "野球部", eiken: "なし" },
  { id: 5, name: "高橋 さくら", grade: "小6", subjects: ["算数", "国語"], school: "○○小学校", targetSchool: "□□中学校", club: "ピアノ", eiken: "5級" },
  { id: 6, name: "伊藤 蓮", grade: "中3", subjects: ["英語", "数学", "理科"], school: "○○中学校", targetSchool: "□□高校", club: "水泳", eiken: "準2級" },
  { id: 7, name: "渡辺 ひなた", grade: "高2", subjects: ["英語", "数学"], school: "□□高校", targetSchool: "○○大学", club: "なし", eiken: "2級" },
  { id: 8, name: "小林 悠斗", grade: "中1", subjects: ["数学", "国語"], school: "○○中学校", targetSchool: "", club: "剣道部", eiken: "なし" },
];

const INITIAL_MATERIALS = [
  // 小学生教科書準拠
  { id: "m1", name: "Z会グレードアップ問題集", category: "教科書準拠（小）", levels: ["小"] },
  { id: "m2", name: "教科書ぴったりトレーニング", category: "教科書準拠（小）", levels: ["小"] },
  { id: "m3", name: "スマイルゼミ対応ドリル", category: "教科書準拠（小）", levels: ["小"] },
  // 中学生教科書準拠
  { id: "m4", name: "ニューホライズン", category: "教科書準拠（中）", levels: ["中"] },
  { id: "m5", name: "Here We Go!", category: "教科書準拠（中）", levels: ["中"] },
  { id: "m6", name: "東京書籍（数学）", category: "教科書準拠（中）", levels: ["中"] },
  { id: "m7", name: "光村図書（国語）", category: "教科書準拠（中）", levels: ["中"] },
  // 市販問題集
  { id: "m8", name: "Tryit", category: "市販問題集", levels: ["中", "高"] },
  { id: "m9", name: "チャート式", category: "市販問題集", levels: ["中", "高"] },
  { id: "m10", name: "システム英単語", category: "市販問題集", levels: ["高"] },
  { id: "m11", name: "入試問題集", category: "市販問題集", levels: ["中", "高"] },
  { id: "m12", name: "標準問題集", category: "市販問題集", levels: ["小", "中", "高"] },
  // 検定教材
  { id: "m13", name: "英検 準2級", category: "検定教材", levels: ["小", "中", "高"] },
  { id: "m14", name: "英検 3級", category: "検定教材", levels: ["小", "中", "高"] },
  { id: "m15", name: "英検 2級", category: "検定教材", levels: ["小", "中", "高"] },
  { id: "m16", name: "漢検", category: "検定教材", levels: ["小", "中", "高"] },
  { id: "m17", name: "数検", category: "検定教材", levels: ["小", "中", "高"] },
  // 塾オリジナル
  { id: "m18", name: "塾オリジナルプリント", category: "塾プリント", levels: ["小", "中", "高"] },
];

const SUBJECTS_BY_LEVEL = {
  小: ["算数", "国語", "理科", "社会", "英語"],
  中: ["数学", "英語", "国語", "理科", "社会"],
  高: ["数学", "英語", "国語", "物理", "化学", "生物", "日本史", "世界史"],
};

const ATTITUDE_OPTIONS = ["とても良い", "良い", "普通", "要改善"];
const UNDERSTANDING_OPTIONS = ["よく理解できた", "概ね理解できた", "要復習", "理解不足"];
const HOMEWORK_OPTIONS = ["◎ 完璧", "○ 提出済", "△ 一部未", "× 未提出", "－ なし"];
const EXERCISE_OPTIONS = ["意欲的", "概ね取組", "時々止まった", "集中できず"];

const SUBJECT_UNITS = {
  英語: ["現在完了形", "関係代名詞", "不定詞の応用", "受動態", "比較表現", "仮定法", "英作文"],
  数学: ["二次方程式", "因数分解", "図形と証明", "確率", "三平方の定理", "関数y=ax²"],
  算数: ["分数の計算", "小数のかけ算", "図形の面積", "割合", "速さ・時間・距離"],
  国語: ["古文基礎", "現代文読解", "作文・記述", "漢字・文法"],
  理科: ["化学変化とイオン", "電流と磁界", "生命の連続性", "天体の動き"],
  社会: ["公民：経済", "歴史：近現代", "地理：世界地理", "公民：政治"],
};

// ===================== COLORS =====================
const C = {
  bg: "#F4F1EC",
  card: "#FFFFFF",
  green: "#3D7A5A",
  greenLight: "#E6F0EB",
  blue: "#3A6B8A",
  blueLight: "#E3EEF5",
  amber: "#B8722A",
  amberLight: "#FDF0E3",
  purple: "#6B4FA0",
  purpleLight: "#EEE8F8",
  red: "#B84444",
  border: "#E2DDD6",
  text: "#2A2A2A",
  sub: "#6B6760",
  muted: "#9E9990",
};

const font = { serif: "'Noto Serif JP', serif", sans: "'Noto Sans JP', sans-serif", mono: "monospace" };

// ===================== SMALL COMPONENTS =====================
function Tag({ children, color = C.green, bg }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: bg || color + "22", color, fontFamily: font.sans }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = C.green, disabled, outline, sm, full }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${full ? "w-full" : ""} ${sm ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} rounded-xl font-bold transition-all`}
      style={{
        background: disabled ? "#C8C4BC" : outline ? "white" : color,
        color: disabled ? "#888" : outline ? color : "white",
        border: outline ? `2px solid ${color}` : "none",
        fontFamily: font.sans,
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
      {children}
    </button>
  );
}

function ChipSelect({ options, value, onChange, color = C.green, vertical }) {
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-wrap"} gap-2 mt-1`}>
      {options.map(opt => {
        const sel = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={`${vertical ? "text-left" : ""} px-3 py-2 rounded-xl text-sm font-medium transition-all`}
            style={{
              border: `2px solid ${sel ? color : C.border}`,
              background: sel ? color : "white",
              color: sel ? "white" : C.text,
              fontFamily: font.sans,
            }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ icon, children, color = C.green }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-base" style={{ fontFamily: font.serif, color }}>{children}</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${className}`} style={{ background: C.card, border: `1px solid ${C.border}` }}>
      {children}
    </div>
  );
}

function AiBadge({ loading }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ml-1"
      style={{ background: "#FFF8E1", color: "#7A5A00", fontFamily: font.mono }}>
      {loading ? "⟳ AI予測中" : "✦ AI提案"}
    </span>
  );
}

// ===================== MATERIAL PICKER =====================
function MaterialPicker({ studentLevel, value, onChange, materials, onAddMaterial }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("市販問題集");
  const [newLevel, setNewLevel] = useState([studentLevel]);
  const [customName, setCustomName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const levelKey = studentLevel?.slice(0, 1) || "中";
  const categories = [...new Set(materials.map(m => m.category))];

  const filtered = activeTab === "all"
    ? materials.filter(m => m.levels.includes(levelKey) || m.category === "検定教材" || m.category === "塾プリント")
    : materials.filter(m => m.category === activeTab);

  const tabList = ["all", ...categories];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: "none" }}>
        {tabList.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            style={{
              background: activeTab === t ? C.blue : "#F0EDE8",
              color: activeTab === t ? "white" : C.sub,
              fontFamily: font.sans,
            }}>
            {t === "all" ? "すべて" : t}
          </button>
        ))}
      </div>

      {/* Material list */}
      <div className="flex flex-wrap gap-2">
        {filtered.map(m => {
          const sel = value?.id === m.id;
          return (
            <button key={m.id} onClick={() => onChange(sel ? null : m)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                border: `2px solid ${sel ? C.blue : C.border}`,
                background: sel ? C.blue : "white",
                color: sel ? "white" : C.text,
                fontFamily: font.sans,
              }}>
              {m.name}
            </button>
          );
        })}

        {/* 生徒持込 */}
        <button
          onClick={() => onChange(value?.id === "custom" ? null : { id: "custom", name: customName || "持込教材", category: "生徒持込" })}
          className="px-3 py-1.5 rounded-xl text-sm font-medium"
          style={{
            border: `2px solid ${value?.id === "custom" ? C.amber : C.border}`,
            background: value?.id === "custom" ? C.amber : "white",
            color: value?.id === "custom" ? "white" : C.text,
            fontFamily: font.sans,
          }}>
          📦 生徒持込
        </button>
      </div>

      {/* 持込の場合は書名入力 */}
      {value?.id === "custom" && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: C.amberLight }}>
          <div className="text-xs font-bold mb-1" style={{ color: C.amber }}>持込教材の書名・内容を入力してください</div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: C.amber + "66" }}
            placeholder="例：塾技100（数学）、学校のワーク、模試の問題など"
            value={customName}
            onChange={e => { setCustomName(e.target.value); onChange({ id: "custom", name: e.target.value || "持込教材", category: "生徒持込" }); }}
          />
        </div>
      )}

      {/* 新規教材追加 */}
      <button onClick={() => setShowAdd(v => !v)}
        className="mt-2 text-xs font-bold flex items-center gap-1"
        style={{ color: C.green }}>
        {showAdd ? "▲ 閉じる" : "＋ 新しい教材を追加"}
      </button>

      {showAdd && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: C.greenLight }}>
          <div className="text-xs font-bold mb-2" style={{ color: C.green }}>新規教材登録</div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
            style={{ borderColor: C.border }}
            placeholder="教材名"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <select className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
            style={{ borderColor: C.border }}
            value={newCat} onChange={e => setNewCat(e.target.value)}>
            <option>教科書準拠（小）</option>
            <option>教科書準拠（中）</option>
            <option>市販問題集</option>
            <option>検定教材</option>
            <option>塾プリント</option>
          </select>
          <div className="text-xs text-gray-500 mb-1">対応学年（複数選択可）</div>
          <div className="flex gap-2 mb-2">
            {["小", "中", "高"].map(l => (
              <button key={l} onClick={() => setNewLevel(v => v.includes(l) ? v.filter(x => x !== l) : [...v, l])}
                className="px-3 py-1 rounded-lg text-sm font-bold"
                style={{ background: newLevel.includes(l) ? C.green : "#E8E4DC", color: newLevel.includes(l) ? "white" : C.sub }}>
                {l}
              </button>
            ))}
          </div>
          <Btn color={C.green} sm disabled={!newName}
            onClick={() => {
              onAddMaterial({ id: "m" + Date.now(), name: newName, category: newCat, levels: newLevel });
              setNewName(""); setShowAdd(false);
            }}>
            追加する
          </Btn>
        </div>
      )}
    </div>
  );
}

// ===================== AI FETCH =====================
async function fetchAIPredictions(student, subject, grade) {
  const units = SUBJECT_UNITS[subject] || [];
  const prompt = `個別指導塾の授業報告AIです。
生徒: ${student}（${grade}）、科目: ${subject}
以下をJSON形式のみで返答（マークダウン不要）:
{
  "unit": ["単元候補1","単元候補2","単元候補3"],
  "homework": ["宿題候補1（具体的）","宿題候補2","宿題候補3"],
  "studyGoal": ["自習目標候補1","自習目標候補2","自習目標候補3"],
  "comment": ["保護者向け一言1（温かく簡潔に）","保護者向け一言2","保護者向け一言3"]
}
単元のヒント: ${units.join("、")}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch { return {}; }
}

function StudentCard({ s, reports, studentDeleteConfirm, setStudentDeleteConfirm, deleteStudent }) {
  const [expanded, setExpanded] = useState(false);
  const reportCnt = (reports || []).filter(r => r.student.id === s.id).length;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <button className="flex items-center gap-3 flex-1 text-left" onClick={() => setExpanded(v => !v)}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: C.green, fontFamily: font.serif }}>{s.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold" style={{ fontFamily: font.serif }}>{s.name}</div>
            <div className="flex gap-1 mt-0.5 flex-wrap">
              <Tag color={C.blue}>{s.grade}</Tag>
              {s.school && <span className="text-xs" style={{ color: C.sub }}>{s.school}</span>}
            </div>
            <div className="flex gap-2 mt-0.5 flex-wrap">
              {s.eiken && s.eiken !== "なし" && <Tag color={C.purple}>英検{s.eiken}</Tag>}
              {s.targetSchool && <Tag color={C.amber}>志望：{s.targetSchool}</Tag>}
              <span className="text-xs" style={{ color: C.muted }}>報告{reportCnt}件</span>
            </div>
          </div>
          <span className="text-xs ml-1" style={{ color: C.muted }}>{expanded ? "▲" : "▼"}</span>
        </button>
        <div className="ml-2 flex-shrink-0">
          {studentDeleteConfirm?.id === s.id ? (
            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs" style={{ color: C.red }}>削除しますか？</span>
              <div className="flex gap-1">
                <Btn sm color={C.red} onClick={() => deleteStudent(s)}>はい</Btn>
                <Btn sm outline color={C.sub} onClick={() => setStudentDeleteConfirm(null)}>やめる</Btn>
              </div>
            </div>
          ) : (
            <button onClick={() => setStudentDeleteConfirm(s)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ color: C.muted, background: "#F5F5F2" }}>削除</button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ["在籍校", s.school || "—"],
            ["志望校", s.targetSchool || "なし"],
            ["部活・スポーツ", s.club || "なし"],
            ["英検", s.eiken || "なし"],
            ["よく受講する科目", s.subjects?.length > 0 ? s.subjects.join("・") : "未設定"],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-2 text-xs">
              <span className="font-bold w-24 flex-shrink-0" style={{ color: C.sub }}>{label}</span>
              <span style={{ color: C.text }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}


function ReportForm({ assignment, materials, onAddMaterial, onComplete, onSaveReport, onBack }) {
  const { teacher, student } = assignment;
  const levelKey = student.grade.slice(0, 1);
  // All subjects for this level — teacher can freely choose any on the day
  const allSubjectsForLevel = SUBJECTS_BY_LEVEL[levelKey] || SUBJECTS_BY_LEVEL["中"];
  // Put "よく受講する科目" first as a hint, then show the rest
  const frequentSubs = student.subjects || [];
  const otherSubs = allSubjectsForLevel.filter(s => !frequentSubs.includes(s));
  const subjectsOrdered = [...frequentSubs, ...otherSubs];

  const [step, setStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSug, setAiSug] = useState(null);
  const [form, setForm] = useState({
    subject: student.subjects?.[0] || "",
    material: null, pageRange: "",
    homeworkStatus: "", understanding: "",
    unit: "", guidanceComment: "",
    exerciseContent: "", exerciseResult: "", exerciseCheck: false,
    homework: "", homeworkDue: "",
    studyGoal: "",
    attitude: "", comment: "", concern: "",
  });
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.subject) {
      setAiLoading(true);
      fetchAIPredictions(student.name, form.subject, student.grade)
        .then(d => { setAiSug(d); setAiLoading(false); })
        .catch(() => setAiLoading(false));
    }
  }, [form.subject]);

  const stepDefs = [
    { title: "科目・教材", icon: "📚", color: C.green },
    { title: "個別指導（60分）", icon: "📖", color: C.blue },
    { title: "演習（30分）", icon: "✏️", color: C.amber },
    { title: "次回に向けて", icon: "🎯", color: C.purple },
    { title: "ご家庭へ", icon: "💌", color: C.red },
  ];

  const canNext = [
    form.subject && form.material,
    form.unit && form.homeworkStatus && form.understanding,
    form.exerciseContent && form.exerciseResult,
    form.homework && form.homeworkDue && form.studyGoal,
    form.attitude && form.comment,
  ];

  const generateMail = () => {
    const today = new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
    return `【授業報告】${student.name}さん（${student.grade}・${form.subject}）${today}
担当：${teacher}

■ 今日の授業内容
${form.unit}　／　${form.material?.name || ""}${form.pageRange ? ` p.${form.pageRange}` : ""}
${form.guidanceComment || ""}

■ 理解度：${form.understanding}

■ 宿題
${form.homework}　期限：${form.homeworkDue}

■ 自習目標
${form.studyGoal}

■ 授業の様子
授業態度：${form.attitude}
${form.comment}${form.concern ? `\n\n【気になったこと】\n${form.concern}` : ""}`;
  };

  if (done) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <Card className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-lg font-bold mb-1" style={{ fontFamily: font.serif }}>報告を送信しました</div>
          <div className="text-sm mb-4" style={{ color: C.sub }}>{student.name}さん（{student.grade}・{form.subject}）</div>
          <div className="text-left mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: C.muted }}>速報メール用テキスト</div>
            <div className="text-xs p-3 rounded-xl whitespace-pre-wrap leading-relaxed"
              style={{ background: C.bg, color: C.text, fontFamily: font.sans }}>
              {generateMail()}
            </div>
          </div>
          <Btn full color={C.green} onClick={() => navigator.clipboard?.writeText(generateMail())}>
            📋 コピーする
          </Btn>
          <div className="mt-2">
            <Btn full outline color={C.sub} onClick={onBack}>← 担当一覧に戻る</Btn>
          </div>
        </Card>
      </div>
    );
  }

  const s = stepDefs[step];
  const pct = Math.round(((step + 1) / stepDefs.length) * 100);

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-sm font-bold px-2 py-1 rounded-lg"
            style={{ background: C.border, color: C.sub }}>←</button>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ fontFamily: font.serif }}>{student.name}</div>
            <div className="text-xs" style={{ color: C.sub }}>{student.grade}　担当：{teacher}</div>
          </div>
          <div className="text-xs font-bold" style={{ color: s.color }}>{step + 1}/{stepDefs.length}</div>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: C.border }}>
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}, ${C.blue})` }} />
        </div>
      </div>

      <div className="p-4 pb-28">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: s.color }}>{s.icon}</div>
          <div>
            <div className="text-xs" style={{ color: C.muted, fontFamily: font.mono }}>STEP {step + 1}</div>
            <div className="font-bold" style={{ fontFamily: font.serif, color: C.text }}>{s.title}</div>
          </div>
        </div>

        {/* Step 0: 科目・教材 */}
        {step === 0 && (
          <Card>
            {/* Student profile hint */}
            {(student.targetSchool || student.eiken !== "なし" || student.club) && (
              <div className="mb-4 p-3 rounded-xl text-xs flex flex-wrap gap-2" style={{ background: C.greenLight }}>
                {student.school && <span style={{ color: C.sub }}>🏫 {student.school}</span>}
                {student.targetSchool && <span style={{ color: C.green }}>🎯 志望：{student.targetSchool}</span>}
                {student.club && student.club !== "なし" && <span style={{ color: C.sub }}>⚽ {student.club}</span>}
                {student.eiken && student.eiken !== "なし" && <span style={{ color: C.purple }}>📝 英検{student.eiken}</span>}
              </div>
            )}
            <div className="mb-4">
              <div className="text-sm font-bold mb-1" style={{ color: C.text }}>
                科目 <span className="text-red-500 text-xs">必須</span>
                {frequentSubs.length > 0 && <span className="text-xs font-normal ml-1" style={{ color: C.muted }}>（★がよく受講する科目）</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {subjectsOrdered.map(opt => {
                  const isFav = frequentSubs.includes(opt);
                  const sel = form.subject === opt;
                  return (
                    <button key={opt} onClick={() => set("subject", opt)}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: `2px solid ${sel ? C.green : C.border}`,
                        background: sel ? C.green : "white",
                        color: sel ? "white" : C.text,
                        fontFamily: font.sans,
                      }}>
                      {isFav ? "★ " : ""}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold mb-1" style={{ color: C.text }}>
                使用教材 <span className="text-red-500 text-xs">必須</span>
              </div>
              <MaterialPicker
                studentLevel={student.grade}
                value={form.material}
                onChange={v => set("material", v)}
                materials={materials}
                onAddMaterial={onAddMaterial}
              />
              {form.material && form.material.id !== "custom" && (
                <input className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border, background: "#FAFAF8" }}
                  placeholder="ページ範囲（例：45〜52）"
                  value={form.pageRange}
                  onChange={e => set("pageRange", e.target.value)}
                />
              )}
            </div>
          </Card>
        )}

        {/* Step 1: 個別指導 */}
        {step === 1 && (
          <Card>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">
                今日の単元・項目 <span className="text-red-500 text-xs">必須</span>
                <AiBadge loading={aiLoading} />
              </div>
              {aiSug?.unit && (
                <ChipSelect options={aiSug.unit} value={form.unit} onChange={v => set("unit", v)} color={C.blue} />
              )}
              <input className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8" }}
                placeholder="または直接入力…"
                value={form.unit}
                onChange={e => set("unit", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">宿題の提出 <span className="text-red-500 text-xs">必須</span></div>
              <ChipSelect options={HOMEWORK_OPTIONS} value={form.homeworkStatus} onChange={v => set("homeworkStatus", v)} color={C.blue} />
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">理解度 <span className="text-red-500 text-xs">必須</span></div>
              <ChipSelect options={UNDERSTANDING_OPTIONS} value={form.understanding} onChange={v => set("understanding", v)} color={C.blue} />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">補足コメント（任意）</div>
              <textarea className="w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8", minHeight: 64 }}
                placeholder="つまずいた点など…"
                value={form.guidanceComment}
                onChange={e => set("guidanceComment", e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* Step 2: 演習 */}
        {step === 2 && (
          <Card>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">演習内容 <span className="text-red-500 text-xs">必須</span></div>
              <input className="w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8" }}
                placeholder="例：教科書 p.45〜48 練習問題"
                value={form.exerciseContent}
                onChange={e => set("exerciseContent", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">取り組み状況 <span className="text-red-500 text-xs">必須</span></div>
              <ChipSelect options={EXERCISE_OPTIONS} value={form.exerciseResult} onChange={v => set("exerciseResult", v)} color={C.amber} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5"
                checked={form.exerciseCheck}
                onChange={e => set("exerciseCheck", e.target.checked)}
              />
              <span className="text-sm">演習結果を確認した</span>
            </label>
          </Card>
        )}

        {/* Step 3: 次回に向けて */}
        {step === 3 && (
          <Card>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">
                宿題の内容 <span className="text-red-500 text-xs">必須</span>
                <AiBadge loading={aiLoading} />
              </div>
              {aiSug?.homework && (
                <ChipSelect options={aiSug.homework} value={form.homework} onChange={v => set("homework", v)} color={C.purple} />
              )}
              <input className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8" }}
                placeholder="または直接入力…"
                value={form.homework}
                onChange={e => set("homework", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">提出期限 <span className="text-red-500 text-xs">必須</span></div>
              <input type="date" className="w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8" }}
                value={form.homeworkDue}
                onChange={e => set("homeworkDue", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">
                自習目標 <span className="text-red-500 text-xs">必須</span>
                <AiBadge loading={aiLoading} />
              </div>
              {aiSug?.studyGoal && (
                <ChipSelect options={aiSug.studyGoal} value={form.studyGoal} onChange={v => set("studyGoal", v)} color={C.purple} />
              )}
              <input className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8" }}
                placeholder="または直接入力…"
                value={form.studyGoal}
                onChange={e => set("studyGoal", e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* Step 4: ご家庭へ */}
        {step === 4 && (
          <Card>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">授業態度 <span className="text-red-500 text-xs">必須</span></div>
              <ChipSelect options={ATTITUDE_OPTIONS} value={form.attitude} onChange={v => set("attitude", v)} color={C.red} />
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">
                一言コメント <span className="text-red-500 text-xs">必須</span>
                <AiBadge loading={aiLoading} />
              </div>
              {aiSug?.comment && (
                <div className="flex flex-col gap-2 mt-1 mb-2">
                  {aiSug.comment.map(c => (
                    <button key={c} onClick={() => set("comment", c)}
                      className="text-left px-3 py-2 rounded-xl text-sm border transition-all"
                      style={{
                        border: `2px solid ${form.comment === c ? C.red : C.border}`,
                        background: form.comment === c ? C.red : "white",
                        color: form.comment === c ? "white" : C.text,
                        fontFamily: font.sans,
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <textarea className="w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8", minHeight: 80 }}
                placeholder="または直接入力・編集…"
                value={form.comment}
                onChange={e => set("comment", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">気になったこと（任意）</div>
              <textarea className="w-full border rounded-xl px-3 py-2 text-sm"
                style={{ borderColor: C.border, background: "#FAFAF8", minHeight: 60 }}
                placeholder="体調・集中度・気になる言動など"
                value={form.concern}
                onChange={e => set("concern", e.target.value)}
              />
            </div>
          </Card>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3"
        style={{ background: "linear-gradient(to top, #F4F1EC 70%, transparent)", borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <Btn outline color={C.sub} onClick={() => setStep(s => s - 1)}>← 戻る</Btn>
          )}
          {step < stepDefs.length - 1 ? (
            <Btn full color={s.color} disabled={!canNext[step]} onClick={() => setStep(s => s + 1)}>
              次へ →
            </Btn>
          ) : (
            <Btn full color={C.red} disabled={!canNext[step]} onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              if (onSaveReport) onSaveReport({ ...form, date: today, teacher, student });
              setDone(true);
            }}>
              送信する ✓
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== TEACHER VIEW =====================
function TeacherView({ teacher, assignments, materials, onAddMaterial, onSaveReport, onBack }) {
  const myAssignments = assignments.filter(a => a.teacher === teacher);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState([]);

  if (selected) {
    return (
      <ReportForm
        assignment={selected}
        materials={materials}
        onAddMaterial={onAddMaterial}
        onSaveReport={onSaveReport}
        onComplete={() => { setCompleted(c => [...c, selected.student.id]); setSelected(null); }}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-sm font-bold px-2 py-1 rounded-lg"
          style={{ background: C.border, color: C.sub }}>←</button>
        <div>
          <div className="text-xs" style={{ color: C.muted }}>担当一覧</div>
          <div className="text-xl font-bold" style={{ fontFamily: font.serif }}>{teacher}</div>
        </div>
        <div className="ml-auto text-sm font-bold px-3 py-1 rounded-full"
          style={{ background: C.greenLight, color: C.green }}>
          {completed.length}/{myAssignments.length} 完了
        </div>
      </div>

      {myAssignments.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <div className="text-sm">本日の担当はありません</div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {myAssignments.map(a => {
            const done = completed.includes(a.student.id);
            return (
              <button key={a.student.id} onClick={() => !done && setSelected(a)}
                className="w-full text-left rounded-2xl p-4 transition-all"
                style={{
                  background: done ? "#F0F0F0" : C.card,
                  border: `1px solid ${done ? "#D0D0D0" : C.border}`,
                  opacity: done ? 0.7 : 1,
                  boxShadow: done ? "none" : "0 1px 6px rgba(0,0,0,0.06)",
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: done ? "#AAA" : C.green, fontFamily: font.serif }}>
                      {a.student.name[0]}
                    </div>
                    <div>
                      <div className="font-bold" style={{ fontFamily: font.serif, color: done ? "#AAA" : C.text }}>
                        {a.student.name}
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        <Tag color={C.blue}>{a.student.grade}</Tag>
                        {a.student.subjects.map(s => <Tag key={s} color={C.amber}>{s}</Tag>)}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg">{done ? "✅" : "→"}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== ADMIN PAGE =====================
function AdminPage({ teachers, setTeachers, students, setStudents, reports, assignments, setAssignments, materials, setMaterials, onSelectTeacher }) {
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");

  // Materials state
  const [newMat, setNewMat] = useState({ name: "", category: "市販問題集", levels: ["中"] });
  const [showMatAdd, setShowMatAdd] = useState(false);
  const categories = [...new Set(materials.map(m => m.category))];

  // Teacher mgmt state
  const [newTeacherName, setNewTeacherName] = useState("");
  const [showTeacherAdd, setShowTeacherAdd] = useState(false);
  const [teacherDeleteConfirm, setTeacherDeleteConfirm] = useState(null);

  // Student mgmt state
  const [showStudentAdd, setShowStudentAdd] = useState(false);
  const [studentDeleteConfirm, setStudentDeleteConfirm] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", grade: "中1", subjects: [], school: "", targetSchool: "", club: "", eiken: "なし" });
  const GRADES_ALL = ["小1","小2","小3","小4","小5","小6","中1","中2","中3","高1","高2","高3"];

  // Reports filter state
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const toggleAssignment = (teacher, student) => {
    const exists = assignments.find(a => a.teacher === teacher && a.student.id === student.id);
    if (exists) {
      setAssignments(prev => prev.filter(a => !(a.teacher === teacher && a.student.id === student.id)));
    } else {
      const teacherCount = assignments.filter(a => a.teacher === teacher).length;
      if (teacherCount >= 8) return;
      setAssignments(prev => [...prev, { teacher, student }]);
    }
  };

  const addTeacher = () => {
    const name = newTeacherName.trim();
    if (!name) return;
    const full = name.endsWith("先生") ? name : name + " 先生";
    if (teachers.includes(full)) return;
    setTeachers(prev => [...prev, full]);
    setNewTeacherName(""); setShowTeacherAdd(false);
  };

  const deleteTeacher = (t) => {
    setTeachers(prev => prev.filter(x => x !== t));
    setAssignments(prev => prev.filter(a => a.teacher !== t));
    setTeacherDeleteConfirm(null);
  };

  const toggleNewStudentSubject = (sub) => {
    setNewStudent(v => ({
      ...v,
      subjects: v.subjects.includes(sub) ? v.subjects.filter(s => s !== sub) : [...v.subjects, sub],
    }));
  };

  const addStudent = () => {
    if (!newStudent.name.trim()) return;
    setStudents(prev => [...prev, {
      name: newStudent.name.trim(),
      grade: newStudent.grade,
      subjects: newStudent.subjects,
      school: newStudent.school || "",
      targetSchool: newStudent.targetSchool || "",
      club: newStudent.club || "",
      eiken: newStudent.eiken || "なし",
      id: Date.now(),
    }]);
    setNewStudent({ name: "", grade: "中1", subjects: [], school: "", targetSchool: "", club: "", eiken: "なし" });
    setShowStudentAdd(false);
  };

  const deleteStudent = (s) => {
    setStudents(prev => prev.filter(x => x.id !== s.id));
    setAssignments(prev => prev.filter(a => a.student.id !== s.id));
    setStudentDeleteConfirm(null);
  };

  const levelSubjects = (grade) => {
    const k = grade.slice(0, 1);
    return SUBJECTS_BY_LEVEL[k] || SUBJECTS_BY_LEVEL["中"];
  };

  const understandingColor = (u) => {
    if (u === "よく理解できた") return C.green;
    if (u === "概ね理解できた") return C.blue;
    if (u === "要復習") return C.amber;
    return C.red;
  };

  const filteredReports = (reports || []).filter(r => {
    if (filterStudent !== "all" && r.student.id !== parseInt(filterStudent)) return false;
    if (filterTeacher !== "all" && r.teacher !== filterTeacher) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-2xl mx-auto p-4 pb-10">
      {/* Header */}
      <div className="mb-4">
        <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: C.muted, fontFamily: font.mono }}>ADMIN</div>
        <div className="text-2xl font-bold" style={{ fontFamily: font.serif, color: C.text }}>管理者ページ</div>
        <div className="text-sm mt-0.5" style={{ color: C.sub }}>{today}</div>
      </div>

      {/* Tabs — scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
        {[
          ["schedule", "📅 割当"],
          ["teachers", "👩‍🏫 教師"],
          ["students", "🎒 生徒"],
          ["materials", "📚 教材"],
          ["reports", "📋 報告履歴"],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className="flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all"
            style={{
              background: activeTab === k ? C.green : C.border,
              color: activeTab === k ? "white" : C.sub,
              fontFamily: font.sans,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ===== TAB: 割当 ===== */}
      {activeTab === "schedule" && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
            {teachers.map(t => {
              const cnt = assignments.filter(a => a.teacher === t).length;
              const active = activeTeacher === t;
              return (
                <button key={t} onClick={() => setActiveTeacher(active ? null : t)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: active ? C.green : C.card,
                    color: active ? "white" : C.text,
                    border: `1px solid ${active ? C.green : C.border}`,
                    fontFamily: font.sans,
                  }}>
                  {t.replace(" 先生", "")}
                  <span className="ml-1 text-xs opacity-70">({cnt})</span>
                </button>
              );
            })}
          </div>

          {!activeTeacher ? (
            <div className="flex flex-col gap-3">
              {teachers.map(t => {
                const myStudents = assignments.filter(a => a.teacher === t).map(a => a.student);
                return (
                  <Card key={t}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold" style={{ fontFamily: font.serif }}>{t}</div>
                      <div className="flex gap-2">
                        <Tag color={C.green}>{myStudents.length}名</Tag>
                        <Btn sm color={C.blue} onClick={() => onSelectTeacher(t)}>入力画面へ</Btn>
                      </div>
                    </div>
                    {myStudents.length === 0 ? (
                      <div className="text-sm text-gray-400">未割当</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {myStudents.map(s => (
                          <div key={s.id} className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm"
                            style={{ background: C.greenLight, color: C.green, fontFamily: font.sans }}>
                            {s.name}<span style={{ color: C.muted, fontSize: 11 }}>（{s.grade}）</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <SectionTitle icon="✏️" color={C.green}>{activeTeacher}の担当生徒を選ぶ</SectionTitle>
              <div className="text-xs mb-3" style={{ color: C.muted }}>最大8名まで選択可</div>
              <div className="flex flex-col gap-2">
                {students.map(s => {
                  const assigned = !!assignments.find(a => a.teacher === activeTeacher && a.student.id === s.id);
                  const otherTeacher = assignments.find(a => a.teacher !== activeTeacher && a.student.id === s.id)?.teacher;
                  const teacherFull = assignments.filter(a => a.teacher === activeTeacher).length >= 8 && !assigned;
                  return (
                    <button key={s.id} onClick={() => !teacherFull && toggleAssignment(activeTeacher, s)}
                      disabled={teacherFull}
                      className="flex items-center justify-between p-3 rounded-xl transition-all text-left"
                      style={{
                        background: assigned ? C.greenLight : teacherFull ? "#F5F5F5" : "white",
                        border: `1.5px solid ${assigned ? C.green : C.border}`,
                        opacity: teacherFull ? 0.5 : 1,
                      }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: assigned ? C.green : "#C8C4BC" }}>{s.name[0]}</div>
                        <div>
                          <div className="font-bold text-sm" style={{ fontFamily: font.serif }}>{s.name}</div>
                          <div className="flex gap-1 mt-0.5">
                            <Tag color={C.blue}>{s.grade}</Tag>
                            {s.subjects.slice(0, 2).map(sub => <Tag key={sub} color={C.amber}>{sub}</Tag>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {otherTeacher && !assigned && (
                          <span className="text-xs" style={{ color: C.muted }}>{otherTeacher.replace(" 先生", "")}担当</span>
                        )}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ border: `2px solid ${assigned ? C.green : C.border}`, background: assigned ? C.green : "white", color: "white" }}>
                          {assigned ? "✓" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ===== TAB: 教師管理 ===== */}
      {activeTab === "teachers" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-bold" style={{ color: C.sub }}>登録教師　{teachers.length}名</div>
            <Btn sm color={C.green} onClick={() => setShowTeacherAdd(v => !v)}>
              {showTeacherAdd ? "▲ 閉じる" : "＋ 教師を追加"}
            </Btn>
          </div>

          {showTeacherAdd && (
            <Card>
              <div className="text-sm font-bold mb-2" style={{ color: C.green }}>新しい教師を登録</div>
              <div className="flex gap-2">
                <input className="flex-1 border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border }}
                  placeholder="名前（例：田中）→ 自動で「先生」を付けます"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTeacher()}
                />
                <Btn color={C.green} disabled={!newTeacherName.trim()} onClick={addTeacher}>追加</Btn>
              </div>
            </Card>
          )}

          {teachers.map(t => {
            const cnt = assignments.filter(a => a.teacher === t).length;
            const reportCnt = (reports || []).filter(r => r.teacher === t).length;
            return (
              <Card key={t}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: C.blue, fontFamily: font.serif }}>{t[0]}</div>
                    <div>
                      <div className="font-bold" style={{ fontFamily: font.serif }}>{t}</div>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: C.sub }}>今日の担当：{cnt}名</span>
                        <span className="text-xs" style={{ color: C.muted }}>報告件数：{reportCnt}件</span>
                      </div>
                    </div>
                  </div>
                  {teacherDeleteConfirm === t ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-xs" style={{ color: C.red }}>削除しますか？</span>
                      <Btn sm color={C.red} onClick={() => deleteTeacher(t)}>はい</Btn>
                      <Btn sm outline color={C.sub} onClick={() => setTeacherDeleteConfirm(null)}>やめる</Btn>
                    </div>
                  ) : (
                    <button onClick={() => setTeacherDeleteConfirm(t)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: C.muted, background: "#F5F5F2" }}>削除</button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ===== TAB: 生徒管理 ===== */}
      {activeTab === "students" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-bold" style={{ color: C.sub }}>登録生徒　{students.length}名</div>
            <Btn sm color={C.green} onClick={() => setShowStudentAdd(v => !v)}>
              {showStudentAdd ? "▲ 閉じる" : "＋ 生徒を追加"}
            </Btn>
          </div>

          {showStudentAdd && (
            <Card>
              <div className="text-sm font-bold mb-3" style={{ color: C.green }}>新しい生徒を登録</div>

              {/* 氏名 */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>氏名 <span className="text-red-500">必須</span></div>
                <input className="w-full border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border }} placeholder="例：山田 太郎"
                  value={newStudent.name} onChange={e => setNewStudent(v => ({ ...v, name: e.target.value }))} />
              </div>

              {/* 学年 */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>学年 <span className="text-red-500">必須</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {["小1","小2","小3","小4","小5","小6","中1","中2","中3","高1","高2","高3"].map(g => (
                    <button key={g} onClick={() => setNewStudent(v => ({ ...v, grade: g, subjects: [] }))}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: newStudent.grade === g ? C.blue : "#F0EDE8", color: newStudent.grade === g ? "white" : C.sub }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* よく使う科目（任意・参考用） */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>
                  よく受講する科目（任意）
                  <span className="font-normal ml-1" style={{ color: C.muted }}>※授業ごとに変更できます</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {levelSubjects(newStudent.grade).map(sub => (
                    <button key={sub} onClick={() => toggleNewStudentSubject(sub)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: newStudent.subjects.includes(sub) ? C.amber : "#F0EDE8", color: newStudent.subjects.includes(sub) ? "white" : C.sub }}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* 在籍校 */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>在籍する学校名</div>
                <input className="w-full border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border }} placeholder="例：○○中学校"
                  value={newStudent.school} onChange={e => setNewStudent(v => ({ ...v, school: e.target.value }))} />
              </div>

              {/* 志望校 */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>志望校名（なければ空欄）</div>
                <input className="w-full border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border }} placeholder="例：△△高校"
                  value={newStudent.targetSchool} onChange={e => setNewStudent(v => ({ ...v, targetSchool: e.target.value }))} />
              </div>

              {/* 部活・スポーツ */}
              <div className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>部活・スポーツ（なければ「なし」）</div>
                <input className="w-full border rounded-xl px-3 py-2 text-sm"
                  style={{ borderColor: C.border }} placeholder="例：サッカー部、ピアノなど"
                  value={newStudent.club} onChange={e => setNewStudent(v => ({ ...v, club: e.target.value }))} />
              </div>

              {/* 英検レベル */}
              <div className="mb-4">
                <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>英検レベル</div>
                <div className="flex flex-wrap gap-1.5">
                  {EIKEN_LEVELS.map(lv => (
                    <button key={lv} onClick={() => setNewStudent(v => ({ ...v, eiken: lv }))}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: newStudent.eiken === lv ? C.purple : "#F0EDE8", color: newStudent.eiken === lv ? "white" : C.sub }}>
                      {lv}
                    </button>
                  ))}
                </div>
              </div>

              <Btn full color={C.green} disabled={!newStudent.name.trim()} onClick={addStudent}>登録する</Btn>
            </Card>
          )}

          {students.map(s => (
            <StudentCard
              key={s.id} s={s} reports={reports}
              studentDeleteConfirm={studentDeleteConfirm}
              setStudentDeleteConfirm={setStudentDeleteConfirm}
              deleteStudent={deleteStudent}
            />
          ))}
        </div>
      )}

      {/* ===== TAB: 教材管理 ===== */}
      {activeTab === "materials" && (
        <div className="flex flex-col gap-4">
          {categories.map(cat => (
            <Card key={cat}>
              <SectionTitle icon="📗" color={C.blue}>{cat}</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {materials.filter(m => m.category === cat).map(m => (
                  <div key={m.id} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm"
                    style={{ background: C.blueLight, color: C.blue, fontFamily: font.sans }}>
                    {m.name}
                    <span className="text-xs ml-1" style={{ color: C.muted }}>[{m.levels.join("・")}]</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card>
            <button onClick={() => setShowMatAdd(v => !v)}
              className="w-full text-left font-bold text-sm flex items-center gap-2"
              style={{ color: C.green }}>
              <span className="text-lg">{showMatAdd ? "▲" : "＋"}</span>新しい教材を追加
            </button>
            {showMatAdd && (
              <div className="mt-3">
                <input className="w-full border rounded-xl px-3 py-2 text-sm mb-2"
                  style={{ borderColor: C.border }} placeholder="教材名"
                  value={newMat.name} onChange={e => setNewMat(v => ({ ...v, name: e.target.value }))} />
                <select className="w-full border rounded-xl px-3 py-2 text-sm mb-2"
                  style={{ borderColor: C.border }}
                  value={newMat.category} onChange={e => setNewMat(v => ({ ...v, category: e.target.value }))}>
                  <option>教科書準拠（小）</option><option>教科書準拠（中）</option>
                  <option>市販問題集</option><option>検定教材</option><option>塾プリント</option>
                </select>
                <div className="flex gap-2 mb-3">
                  {["小","中","高"].map(l => (
                    <button key={l} onClick={() => setNewMat(v => ({ ...v, levels: v.levels.includes(l) ? v.levels.filter(x => x !== l) : [...v.levels, l] }))}
                      className="px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ background: newMat.levels.includes(l) ? C.green : C.border, color: newMat.levels.includes(l) ? "white" : C.sub }}>
                      {l}
                    </button>
                  ))}
                </div>
                <Btn full color={C.green} disabled={!newMat.name} onClick={() => {
                  setMaterials(prev => [...prev, { id: "m" + Date.now(), ...newMat }]);
                  setNewMat({ name: "", category: "市販問題集", levels: ["中"] }); setShowMatAdd(false);
                }}>追加する</Btn>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ===== TAB: 報告履歴 ===== */}
      {activeTab === "reports" && (
        <div>
          {selectedReport ? (
            <div>
              <button onClick={() => setSelectedReport(null)} className="text-sm font-bold px-3 py-1.5 rounded-lg mb-4"
                style={{ background: C.border, color: C.sub }}>← 一覧に戻る</button>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold" style={{ fontFamily: font.serif }}>{selectedReport.student.name}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Tag color={C.blue}>{selectedReport.student.grade}</Tag>
                      <Tag color={C.amber}>{selectedReport.subject}</Tag>
                      <Tag color={C.muted}>{selectedReport.date}</Tag>
                    </div>
                  </div>
                  <div className="text-xs text-right" style={{ color: C.sub }}>担当：{selectedReport.teacher}</div>
                </div>
                {[
                  ["📖 個別指導", [
                    ["単元", selectedReport.unit],
                    ["教材", `${selectedReport.material}${selectedReport.pageRange ? ` p.${selectedReport.pageRange}` : ""}`],
                    ["宿題提出", selectedReport.homeworkStatus],
                    ["理解度", selectedReport.understanding],
                    selectedReport.guidanceComment ? ["コメント", selectedReport.guidanceComment] : null,
                  ].filter(Boolean)],
                  ["✏️ 演習", [
                    ["内容", selectedReport.exerciseContent],
                    ["取り組み", selectedReport.exerciseResult],
                  ]],
                  ["🎯 次回に向けて", [
                    ["宿題", selectedReport.homework],
                    ["期限", selectedReport.homeworkDue],
                    ["自習目標", selectedReport.studyGoal],
                  ]],
                  ["💌 ご家庭へ", [
                    ["態度", selectedReport.attitude],
                    ["コメント", selectedReport.comment],
                    selectedReport.concern ? ["気になった点", selectedReport.concern] : null,
                  ].filter(Boolean)],
                ].map(([section, rows]) => (
                  <div key={section} className="mb-4">
                    <div className="text-sm font-bold mb-2" style={{ color: C.sub, fontFamily: font.serif }}>{section}</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {rows.map(([label, val], i) => (
                        <div key={label} className="flex text-sm"
                          style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                          <div className="px-3 py-2 font-bold flex-shrink-0 w-20 text-xs flex items-start pt-2.5"
                            style={{ background: "#FAFAF8", color: C.sub }}>{label}</div>
                          <div className="px-3 py-2 flex-1 text-sm" style={{ color: C.text }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <select className="border rounded-xl px-3 py-1.5 text-sm" style={{ borderColor: C.border }}
                  value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
                  <option value="all">生徒：すべて</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select className="border rounded-xl px-3 py-1.5 text-sm" style={{ borderColor: C.border }}
                  value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}>
                  <option value="all">教師：すべて</option>
                  {teachers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="text-xs flex items-center" style={{ color: C.muted }}>{filteredReports.length}件</div>
              </div>

              {filteredReports.length === 0 ? (
                <Card><div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📭</div>該当する報告がありません
                </div></Card>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredReports.map(r => (
                    <button key={r.id} onClick={() => setSelectedReport(r)}
                      className="w-full text-left rounded-2xl p-4 transition-all"
                      style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: C.green, fontFamily: font.serif }}>{r.student.name[0]}</div>
                          <div>
                            <div className="font-bold text-sm" style={{ fontFamily: font.serif }}>{r.student.name}</div>
                            <div className="flex gap-1 mt-0.5 flex-wrap">
                              <Tag color={C.blue}>{r.student.grade}</Tag>
                              <Tag color={C.amber}>{r.subject}</Tag>
                              <span className="text-xs" style={{ color: C.muted }}>{r.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-xs mb-1" style={{ color: C.muted }}>{r.date}</div>
                          <Tag color={understandingColor(r.understanding)}>{r.understanding}</Tag>
                        </div>
                      </div>
                      <div className="mt-2 text-xs" style={{ color: C.sub }}>
                        担当：{r.teacher}　／　{r.material}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== SAMPLE REPORTS =====================
const SAMPLE_REPORTS = [
  {
    id: "r1", date: "2025-06-10", teacher: "山田 先生",
    student: INITIAL_STUDENTS[0], subject: "英語",
    unit: "関係代名詞", material: "ニューホライズン", pageRange: "45〜50",
    homeworkStatus: "○ 提出済", understanding: "概ね理解できた",
    guidanceComment: "who/whichの使い分けで混乱していたが、例文で整理できた",
    exerciseContent: "教科書p.51 練習問題", exerciseResult: "概ね取組",
    homework: "問題集p.32〜34（関係代名詞）", homeworkDue: "2025-06-17",
    studyGoal: "関係代名詞の例文を5つ暗記する",
    attitude: "良い", comment: "集中して取り組めました。宿題もしっかり提出できています。", concern: "",
  },
  {
    id: "r2", date: "2025-06-10", teacher: "佐々木 先生",
    student: INITIAL_STUDENTS[1], subject: "数学",
    unit: "二次方程式", material: "チャート式", pageRange: "88〜92",
    homeworkStatus: "◎ 完璧", understanding: "よく理解できた",
    guidanceComment: "解の公式をしっかり習得できている",
    exerciseContent: "チャートp.93 確認問題", exerciseResult: "意欲的",
    homework: "チャートp.94〜96（応用問題）", homeworkDue: "2025-06-17",
    studyGoal: "解の公式を使った問題を10問解く",
    attitude: "とても良い", comment: "今日は特に集中力が高く、応用問題にも積極的に挑戦していました。", concern: "",
  },
  {
    id: "r3", date: "2025-06-03", teacher: "山田 先生",
    student: INITIAL_STUDENTS[0], subject: "数学",
    unit: "因数分解", material: "Tryit", pageRange: "22〜26",
    homeworkStatus: "△ 一部未", understanding: "要復習",
    guidanceComment: "たすき掛けの理解が不十分。次回も継続",
    exerciseContent: "Tryit p.27 基本問題", exerciseResult: "時々止まった",
    homework: "Tryit p.28（因数分解基本）", homeworkDue: "2025-06-10",
    studyGoal: "たすき掛けの手順を3問ずつ毎日練習",
    attitude: "普通", comment: "難しい部分で手が止まることがありましたが、諦めずに取り組んでいました。", concern: "少し疲れているようでした",
  },
  {
    id: "r4", date: "2025-06-03", teacher: "田村 先生",
    student: INITIAL_STUDENTS[5], subject: "理科",
    unit: "電流と磁界", material: "東京書籍（数学）", pageRange: "112〜118",
    homeworkStatus: "○ 提出済", understanding: "概ね理解できた",
    guidanceComment: "フレミングの左手の法則の向きを実物で確認",
    exerciseContent: "教科書p.119 実力確認", exerciseResult: "概ね取組",
    homework: "プリント（電磁誘導）", homeworkDue: "2025-06-10",
    studyGoal: "フレミングの法則を図で説明できるようにする",
    attitude: "良い", comment: "実験の内容と理論を結び付けて理解しようとする姿勢が素晴らしいです。", concern: "",
  },
];

// ===================== REPORTS LIST PAGE =====================

// ===================== ROOT =====================
export default function App() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [assignments, setAssignments] = useState([
    { teacher: "山田 先生", student: INITIAL_STUDENTS[0] },
    { teacher: "山田 先生", student: INITIAL_STUDENTS[1] },
    { teacher: "山田 先生", student: INITIAL_STUDENTS[2] },
    { teacher: "佐々木 先生", student: INITIAL_STUDENTS[3] },
    { teacher: "佐々木 先生", student: INITIAL_STUDENTS[4] },
    { teacher: "田村 先生", student: INITIAL_STUDENTS[5] },
    { teacher: "田村 先生", student: INITIAL_STUDENTS[6] },
  ]);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [view, setView] = useState("home");

  const handleAddMaterial = (mat) => setMaterials(prev => [...prev, mat]);

  if (view === "admin") {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <div className="sticky top-0 z-20 px-4 pt-3 pb-2 flex items-center gap-3"
          style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => setView("home")} className="text-sm font-bold px-2 py-1 rounded-lg"
            style={{ background: C.border, color: C.sub }}>← ホーム</button>
          <span className="text-sm font-bold" style={{ color: C.text }}>管理者ページ</span>
        </div>
        <AdminPage
          teachers={teachers} setTeachers={setTeachers}
          students={students} setStudents={setStudents}
          reports={reports}
          assignments={assignments} setAssignments={setAssignments}
          materials={materials} setMaterials={setMaterials}
          onSelectTeacher={t => setView("teacher:" + t)}
        />
      </div>
    );
  }

  if (view.startsWith("teacher:")) {
    const teacher = view.replace("teacher:", "");
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <TeacherView
          teacher={teacher}
          assignments={assignments}
          materials={materials}
          onAddMaterial={handleAddMaterial}
          onSaveReport={r => setReports(prev => [...prev, { ...r, id: "r" + Date.now() }])}
          onBack={() => setView("home")}
        />
      </div>
    );
  }

  // Home
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: C.bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1" style={{ fontFamily: font.serif, color: C.text }}>AI学習ジム</div>
          <div className="text-sm" style={{ color: C.sub, fontFamily: font.sans }}>授業報告システム</div>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={() => setView("admin")}
            className="w-full p-5 rounded-2xl text-left transition-all"
            style={{ background: C.green, boxShadow: "0 4px 16px rgba(61,122,90,0.25)" }}>
            <div className="text-2xl mb-2">🔧</div>
            <div className="text-white font-bold text-lg" style={{ fontFamily: font.serif }}>管理者ページ</div>
            <div className="text-white opacity-75 text-sm mt-1">割当・生徒・教師・教材・報告履歴</div>
          </button>

          <div>
            <div className="text-xs font-bold mb-2 px-1" style={{ color: C.muted, fontFamily: font.mono }}>
              教師ログイン（本日出勤）
            </div>
            <div className="flex flex-col gap-2">
              {teachers.map(t => {
                const cnt = assignments.filter(a => a.teacher === t).length;
                return (
                  <button key={t} onClick={() => setView("teacher:" + t)}
                    className="w-full p-4 rounded-2xl text-left flex items-center justify-between transition-all"
                    style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: C.blue, fontFamily: font.serif }}>{t[0]}</div>
                      <div>
                        <div className="font-bold" style={{ fontFamily: font.serif }}>{t}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.sub }}>担当：{cnt}名</div>
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
