# 🔄 Notion Daily Task Auto Reset

> Stop manually resetting your Notion checklist every day.

A lightweight automation that automatically resets only the **Daily Goal** checklist in your Notion workspace while leaving every other block untouched.

The workflow runs automatically every day using **GitHub Actions**, so your planner is ready every morning without any manual effort.

---

## ✨ Demo

https://github.com/user-attachments/assets/YOUR_DEMO_VIDEO

---

## 🚀 Features

- ✅ Automatically resets completed daily tasks
- ✅ Leaves yearly goals and other page content untouched
- ✅ Runs automatically every day with GitHub Actions
- ✅ Uses the official Notion API
- ✅ No local server required
- ✅ Lightweight and easy to configure

---

## 🛠️ Tech Stack

- Node.js
- Notion API
- GitHub Actions

---

## 📂 Project Structure

```text
.
├── .github
│   └── workflows
│       └── reset.yml
├── reset.js
├── package.json
└── README.md
```

---

## ⚙️ How It Works

1. Connects to your Notion workspace.
2. Finds the **Daily Goal** section.
3. Traverses all nested blocks.
4. Detects completed to-do items.
5. Marks them as incomplete.
6. Ignores every other block on the page.

This ensures your planner starts fresh every day without affecting long-term goals or notes.

---

## 📸 Before

✔ Daily tasks completed

```
☑ LeetCode
☑ Backend Revision
☑ Reading
☑ Apply for Jobs
```

---

## 📸 After

Automatically reset at midnight

```
☐ LeetCode
☐ Backend Revision
☐ Reading
☐ Apply for Jobs
```

---

## 🔧 Setup

### 1. Clone the repository

```bash
git clone https://github.com/Aryan681/taskReset.git
cd taskReset
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create a Notion Integration

Visit

https://www.notion.so/my-integrations

- Create a new integration
- Copy the Internal Integration Token
- Share your Notion page with the integration

---

### 4. Add GitHub Secrets

Go to

```
Repository
→ Settings
→ Secrets and Variables
→ Actions
```

Add

```
NOTION_TOKEN
```

Example

```
secret_xxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 5. Configure Workflow

The workflow is located at

```
.github/workflows/reset.yml
```

Example schedule

```yaml
on:
  schedule:
    - cron: "30 18 * * *"
```

Runs every day at **12:00 AM IST**.

---

## ▶ Running Locally

```bash
node reset.js
```

Example output

```text
Connecting to Notion...

Found Daily Goal section.

Scanning todos...

Reset: LeetCode
Reset: Reading
Reset: Backend Revision

Done!
```

---

## 🔒 Safety

The script only modifies the Daily Goal section.

It **does not**

- Delete blocks
- Modify headings
- Touch yearly goals
- Change notes
- Edit any unrelated content

---

## 💡 Why?

Every day I found myself manually resetting the same checklist before starting work.

Instead of repeating the same clicks forever, I automated it.

It only saves a minute or two each day—but those minutes add up.

> The best automation is the one you never have to think about again.

---

## 🚧 Future Improvements

- [ ] Support multiple Daily Goal sections
- [ ] Reset recurring weekly tasks
- [ ] Configuration via environment variables
- [ ] Custom reset schedules
- [ ] Docker support

---

## 🤝 Contributing

Contributions are always welcome.

Feel free to open an issue or submit a pull request.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It really helps!

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Aryan Singh**

GitHub

https://github.com/Aryan681

LinkedIn

https://www.linkedin.com/in/aryansingh1-2-/
