import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// --- レートリミットのためのシンプルなインメモリキャッシュ ---
// NOTE: Vercelのサーバーレス環境ではインスタンスがリクエストごとに異なる可能性があるため、
// 本番環境で厳格なレートリミットが必要な場合は、Upstash Redisなどの外部サービスを推奨します。
// ここでは、基本的な保護層として機能します。
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_DURATION = 600000; // 制限時間: 10分 (ミリ秒)
const RATE_LIMIT_COUNT = 1;      // 制限時間内の最大リクエスト数: 1回

export async function POST(request: NextRequest) {
  // --- レートリミット処理 ---
  // Vercel環境ではx-forwarded-forヘッダーからIPを取得するのが一般的
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const now = Date.now();
  const limit = rateLimitCache.get(ip) ?? { count: 0, timestamp: now };

  if (now - limit.timestamp < RATE_LIMIT_DURATION) {
    if (limit.count >= RATE_LIMIT_COUNT) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ error: '短時間に多くのリクエストが送信されました。しばらく待ってから再度お試しください。' }, { status: 429 });
    }
    limit.count++;
  } else {
    // 制限時間が経過していればリセット
    limit.count = 1;
    limit.timestamp = now;
  }
  rateLimitCache.set(ip, limit);
  
  // --- バリデーション処理 ---
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'すべての必須項目を入力してください。' }, { status: 400 });
  }

  // 名前の長さチェック (2文字以上50文字以下)
  if (name.trim().length < 2 || name.trim().length > 50) {
    return NextResponse.json({ error: 'お名前は2文字以上50文字以下で入力してください。' }, { status: 400 });
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: '有効なメールアドレスを入力してください。' }, { status: 400 });
  }

  // メッセージの長さチェック (10文字以上1000文字以下)
  if (message.trim().length < 10 || message.trim().length > 1000) {
    return NextResponse.json({ error: 'お問い合わせ内容は10文字以上1000文字以下で入力してください。' }, { status: 400 });
  }

  // --- メール送信処理 ---
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // Gmailのアプリパスワード
    },
  });

  const mailOptionsToAdmin = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `【IT言葉辞典】お問い合わせ: ${name}様より`,
    replyTo: email,
    html: `
      <h1>IT言葉辞典 お問い合わせフォーム</h1>
      <p><strong>お名前:</strong> ${name}</p>
      <p><strong>メールアドレス:</strong> ${email}</p>
      <hr>
      <p><strong>お問い合わせ内容:</strong></p>
      <p style="white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    `, // 簡単なHTMLエスケープを追加
  };

  try {
    await transporter.sendMail(mailOptionsToAdmin);
    return NextResponse.json({ success: true, message: 'メッセージが正常に送信されました。' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'メールの送信中にエラーが発生しました。' }, { status: 500 });
  }
}