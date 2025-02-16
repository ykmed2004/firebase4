"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const handleAuth = async () => {
    try {
        if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        } else {
        await createUserWithEmailAndPassword(auth, email, password);
        }
      router.push("/todo"); // ログイン成功後、Todoページへ移動
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        alert("エラー: " + error.message);
    }
    };

    return (
    <main className="p-6 max-w-md mx-auto bg-yellow-50 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        {isLogin ? "🔐 ログイン" : "📝 新規登録"}
        </h1>
        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
        <input
            type="email"
            placeholder="📧 メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-yellow-400 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 mb-3"
        />
        <input
            type="password"
            placeholder="🔑 パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-yellow-400 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        />
        <button
            onClick={handleAuth}
            className="w-full bg-yellow-500 text-white font-bold p-3 rounded-xl hover:bg-yellow-600 transition-all"
        >
            {isLogin ? "ログイン" : "登録"}
        </button>
        <p
            className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-yellow-700"
            onClick={() => setIsLogin(!isLogin)}
        >
            {isLogin ? "アカウントを持っていませんか？新規登録はこちら" : "既にアカウントをお持ちですか？ログインはこちら"}
        </p>
        </div>
    </main>
    );
}

