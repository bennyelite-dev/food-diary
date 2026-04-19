# הגדרת יומן האכילה — מדריך מהיר

## שלב 1 — יצירת פרויקט Supabase

1. היכנס ל-[supabase.com](https://supabase.com) וצור חשבון חינמי
2. לחץ **New Project**, בחר שם ואזור (Europe West מומלץ)
3. עבור ל-**SQL Editor** → הדבק את תוכן `schema.sql` → לחץ **Run**
4. עבור ל-**Settings → API**:
   - העתק את **Project URL** (נראה כמו `https://xxxx.supabase.co`)
   - העתק את **anon public** key (מחרוזת ארוכה שמתחילה ב-`eyJ`)

---

## שלב 2 — עדכון `supabase.js`

פתח את הקובץ `supabase.js` ועדכן את 3 השורות הראשונות:

```js
const SUPABASE_URL      = 'https://xxxx.supabase.co';   // ← ה-URL שלך
const SUPABASE_ANON_KEY = 'eyJhbGci...';                 // ← ה-key שלך
const ADMIN_PASSWORD    = 'הסיסמה-שלך';                 // ← שנה לסיסמה חזקה!
```

---

## שלב 3 — העלאה ל-GitHub Pages

1. צור חשבון ב-[github.com](https://github.com) אם אין לך
2. לחץ **New repository**, תן שם (למשל `food-diary`), בחר **Public**
3. גרור את כל הקבצים לדף הריפוזיטורי (drag & drop)
4. עבור ל-**Settings → Pages → Source → Deploy from branch → main → / (root)** → **Save**
5. כעבור כ-60 שניות האתר יהיה חי בכתובת:
   `https://YOUR-USERNAME.github.io/food-diary/`

---

## שלב 4 — הוספת הלוגו

- שמור את קובץ הלוגו שלך בשם `logo.png` בתוך תיקיית הפרויקט
- גודל מומלץ: 200×200 פיקסל לפחות, רקע שקוף (PNG)
- העלה אותו ל-GitHub יחד עם שאר הקבצים

---

## שלב 5 — ניהול לקוחות

1. פתח: `https://YOUR-USERNAME.github.io/food-diary/admin.html`
2. הכנס את סיסמת הניהול שהגדרת ב-`supabase.js`
3. צור לקוח חדש → הקישור האישי יועתק אוטומטית ללוח
4. שלח את הקישור ללקוח — הוא נכנס ומתחיל לרשום

---

## מבנה קבצים

```
food-diary/
├── index.html      ← דף הלקוח (נפתח עם ?t=TOKEN)
├── admin.html      ← פאנל ניהול התזונאי
├── app.js          ← לוגיקת האפליקציה
├── supabase.js     ← חיבור ל-Supabase (עדכן URL+KEY כאן!)
├── db.js           ← מאגר המזונות (450+ פריטים)
├── charts.js       ← גרפים
├── style.css       ← עיצוב
├── logo.png        ← הלוגו שלך (הוסף בעצמך)
└── schema.sql      ← הרץ פעם אחת ב-Supabase SQL Editor
```

---

## שאלות נפוצות

**Q: הלקוח איבד את הקישור, מה עושים?**
A: פאנל הניהול → לחץ "העתק קישור" ליד שמו → שלח שוב.

**Q: אני רוצה לאפס את הנתונים של לקוח**
A: מחק אותו ב-admin → צור חדש עם אותו שם → קישור חדש.

**Q: האם הנתונים מאובטחים?**
A: כל לקוח ניגש רק לנתונים שלו דרך הטוקן הייחודי שלו. הטוקן הוא 16 תווים אקראיים — קשה מאוד לנחש.
