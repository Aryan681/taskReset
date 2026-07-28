<div align="center">

# 🔄 Notion Daily Task Auto Reset

### *Never reset your Notion checklist manually again.*

Automatically resets your **Daily Goal** checklist every day while keeping the rest of your Notion workspace completely untouched.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Notion API](https://img.shields.io/badge/Notion-API-000000?logo=notion)](https://developers.notion.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🎥 **Demo:** *Add your video/gif here*

</div>

---

# ✨ Why?

Every morning I found myself doing the exact same thing.

- Open Notion
- Uncheck yesterday's completed tasks
- Start working

It only took a minute.

But repeating the same task every single day felt unnecessary.

So instead of changing my routine...

I automated it.

---

# 🚀 What it does

✅ Finds your Daily Goal checklist

✅ Resets only completed tasks

✅ Preserves every other block on the page

✅ Runs automatically every day

✅ Zero manual work

---

# ⚡ How it works

```text
GitHub Actions
        │
        ▼
Runs every midnight
        │
        ▼
Node.js Script
        │
        ▼
Notion API
        │
        ▼
Find Daily Goal section
        │
        ▼
Reset completed todos
        │
        ▼
Done ✅
```

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Notion API | Read & Update blocks |
| GitHub Actions | Scheduled automation |

---

# 📂 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── reset.yml
│
├── reset.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Aryan681/taskReset.git
```

Install dependencies

```bash
npm install
```

Create a Notion Integration.

Share your page with the integration.

Add

```env
NOTION_TOKEN=your_secret_here
```

Run

```bash
node reset.js
```

---

# 🕛 Automation

The project uses **GitHub Actions**.

```yaml
schedule:
    - cron: "30 18 * * *"
```

Runs every day at **12:00 AM IST**.

---

# 🔒 Safety

Unlike generic Notion scripts, this project **doesn't touch your whole page.**

It only resets the **Daily Goal** section.

Everything else remains untouched.

- ✅ Headings
- ✅ Notes
- ✅ Images
- ✅ Yearly Goals
- ✅ Other databases

---

# 💡 Motivation

> The best automation is the one you never have to think about again.

This project saves only a minute or two each day.

But it removes one repetitive task forever.

---

# ⭐ Future Improvements

- [ ] Weekly recurring tasks
- [ ] Multiple Daily Goal sections
- [ ] Docker support
- [ ] CLI interface
- [ ] NPM package

---

# 🤝 Contributing

Pull requests are welcome.

If you find a bug or have an idea, feel free to open an issue.

---

# 👨‍💻 Author

### Aryan Singh

Backend Developer

GitHub

https://github.com/Aryan681

LinkedIn

https://linkedin.com/in/aryansingh1-2-/

---

<div align="center">

### ⭐ If you found this useful, consider giving the repository a star.

</div>
