"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    text: string;
}

export default function TodoPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const router = useRouter();

    const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
    }));
    setTasks(tasksData);
    };

    const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), { text: newTask });
    setNewTask("");
    fetchTasks();
    };

    const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
    };

    const handleLogout = async () => {
    try {
        await signOut(auth);
      router.push("/auth"); // ログインページにリダイレクト
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        alert("ログアウトに失敗しました: " + error.message);
    }
    };

    useEffect(() => {
    fetchTasks();
    }, []);

    return (
    <main className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Todo リスト</h1>
        <div className="mb-4">
        <input
            type="text"
            placeholder="新しいタスクを追加"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 border rounded mb-2"
        />
        <button
            onClick={addTask}
            className="w-full bg-green-500 text-white p-2 rounded"
        >
            追加
        </button>
        </div>
        <ul>
        {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center mb-2">
            <span>{task.text}</span>
            <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 underline"
            >
                削除
            </button>
            </li>
        ))}
        </ul>
        <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
        ログアウト
        </button>
    </main>
    );
}

