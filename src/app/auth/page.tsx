"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

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
        router.push("/todo");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        alert(error.message);
    }
    };

    return (
    <main className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">{isLogin ? "ログイン" : "新規登録"}</h1>
        <div className="mb-4">
        <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
        />
        <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
        />
        </div>
        <button
        onClick={handleAuth}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
        {isLogin ? "ログイン" : "新規登録"}
        </button>
        <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-blue-500 underline"
        >
        {isLogin ? "新規登録はこちら" : "ログインはこちら"}
        </button>
    </main>
    );
}
