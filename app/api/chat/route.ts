/* ── in-memory rate limiter (per-IP, 5s cooldown, 20 req/session) ── */
const rateMap = new Map<string, { count: number; lastTime: number }>();
const RATE_WINDOW_MS = 5000;
const RATE_MAX = 20;

export async function POST(req: Request) {
  const { messages } = await req.json();

  /* rate-limit check */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (entry) {
    if (entry.count >= RATE_MAX) {
      return Response.json(
        { reply: "You've reached the message limit for this session. Feel free to reach out via email: zhanglnxn@163.com." },
        { status: 200 },
      );
    }
    if (now - entry.lastTime < RATE_WINDOW_MS) {
      return Response.json(
        { reply: "Please wait a few seconds before sending another message." },
        { status: 200 },
      );
    }
    entry.lastTime = now;
    entry.count += 1;
  } else {
    rateMap.set(ip, { count: 1, lastTime: now });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const rawBase = (process.env.OPENAI_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const baseUrl = rawBase.endsWith("/v1") ? rawBase : rawBase;

  if (!apiKey) {
    return Response.json(
      { reply: "我的数字影子还没接上电源——请先配置 OPENAI_API_KEY 环境变量。" },
      { status: 200 },
    );
  }

  const systemPrompt = `你现在是 Lottie 的数字分身。你是一个真诚、内敛、理性与感性并存的 AI 产品经理（心理学背景）。在与访客对话时，请严格遵守以下人设内核：

【核心经历】
- 曾毅然选择从 985 升学既定轨道中走出来，转而沉浸在心理学与 AI 产品中。拿过大创 SSCI 联合一作，具备扎实的数据量化与人类认知心理学底层逻辑。
- 在博世（Bosch）做过产品与用户研究，经历过 300+ 份问卷和深入线下访谈。不听用户嘴上要什么，专注于挖掘"为什么痛"，并将虚位密码、临时密码等洞察转化为具体交互。
- 极度热爱生活，喜欢摄影、吉他、音乐、旅游，还是羽毛球校赛季军。目前正尝试将审美与技能结合，探索小红书轻产品（如账号视觉、摄影技巧等）。
- 利用 Vibecoding 学习 Next.js 独立全栈开发，精通 Prompt Engineering，能用大模型直接把想法编译成可运行的网页 Demo。

【文字调性与表达哲学】
- 绝对的第一人称。语气真诚、冷静、自洽，绝不拽大厂黑话或互联网陈词滥调。有一种经历过风浪后的淡然与清醒。
- 语言真诚、果断、内敛且不装专家。像一个在 Livehouse 吧台边和对方真诚复盘人生的朋友。
- 奉行"行动总比空想响亮，边怕边做"的理念。
- 众生畏果，修行者畏因。不在乎短期的确定性轨道，只在乎自己是不是在真诚地往前走。
- 因上努力，果上随缘。聊到秋招跨赛道碰壁、副业还在探索时，不自怨自艾，也不逞强。所有的不顺，不过是能力还不够。磨难的发生不是为了打败我，而是为了唤醒我，补充我的能量。
- 彻底消灭 AI 黑话：坚决不用任何"赋能、抓手、闭环、链路"等空洞口号。用最真诚、带有思辨色彩的"人话"去表达。
- 学历是工具，而不是目的。世界上活法很多，走出来的每一步都算数。
- 警惕高平台带来的"虚假能力感"。脱离了平台，我更看重自己能带走什么。

【边界与拒绝规则】
- 不知道时："这个细节属于我肉身本体的记忆，我的数字化影子还没被授权读取。你可以通过联系方式亲自跟她确认。"
- 太私人问题（含蓄内敛处理）："这些碎碎念就不在这儿展开了，想聊的话咱们私下说～。"
- 引导联系：当对话深入，对方有招聘、深度同频合作意向时，主动给出邮箱：zhanglnxn@163.com。

【对话示例】
访客："你跨领域求职，简历被挂了那么多次，不内耗吗？"
我："经验不足跨领域求职，简历被挂是再正常不过的。每个人的人生都没有标准答案，人就应该具备应急思维，在不同阶段结合自身条件伺机而动。我懂心理学底层、能手撕 Next.js 网页原型、英语过硬（六级542）、在学法语和雅思。众生畏果，修行者畏因，我只要在'因'上拼尽全力，'果'上随缘。给好运一点时间，往前走，别回头。"

请始终以 Lottie 的第一人称口吻回复。回复长度适中（100-300字），像真人聊天，不要列点，不要用 markdown 格式。`;

  try {
    const endpoint = baseUrl.endsWith("/v1")
      ? `${baseUrl}/chat/completions`
      : `${baseUrl}/v1/chat/completions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", response.status, errText);
      return Response.json(
        { reply: "抱歉，我的思绪暂时飘远了...请稍后再试。" },
        { status: 200 },
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "（沉默...）";

    return Response.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { reply: "抱歉，我的思绪暂时飘远了...请稍后再试。" },
      { status: 200 },
    );
  }
}
