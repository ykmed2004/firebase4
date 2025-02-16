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

const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

export default function TodoPage() {
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});
    const [newTask, setNewTask] = useState("");
  const [selectedDay, setSelectedDay] = useState(weekdays[0]); // 初期は月曜日
    const router = useRouter();

    const fetchTasks = async () => {
    const data: { [key: string]: Task[] } = {};
    for (const day of weekdays) {
        const querySnapshot = await getDocs(collection(db, `tasks_${day}`));
        data[day] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        }));
    }
    setTasks(data);
    };

    const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, `tasks_${selectedDay}`), { text: newTask });
    setNewTask("");
    fetchTasks();
    };

    const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, `tasks_${selectedDay}`, id));
    fetchTasks();
    };

    const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push("/auth");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        alert("ログアウトに失敗しました: " + error.message);
    }
    };

    useEffect(() => {
    fetchTasks();
    }, []);

    return (
    <main className="p-6 max-w-lg mx-auto bg-yellow-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-yellow-700 mb-4">📅 曜日ごとのTodoリスト</h1>

      {/* 曜日選択タブ */}
        <div className="flex space-x-2 overflow-x-auto mb-4">
        {weekdays.map((day) => (
            <button
            key={day}
            className={`px-4 py-2 rounded-full font-bold ${
                selectedDay === day ? "bg-yellow-500 text-white" : "bg-gray-800"
            }`}
            onClick={() => setSelectedDay(day)}
            >
            {day}
            </button>
        ))}
        </div>

      {/* タスク入力 */}
        <div className="mb-6">
        <input
            type="text"
            placeholder="✍️ タスクを入力"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-3 border-2 border-yellow-400 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
            onClick={addTask}
            className="w-full mt-2 bg-yellow-500 text-white font-bold p-3 rounded-xl hover:bg-yellow-600 transition-all"
        >
            + 追加
        </button>
        </div>

      {/* タスク一覧 */}
        <ul className="space-y-3">
        {tasks[selectedDay]?.map((task) => (
            <li key={task.id} className="flex justify-between items-center p-4 bg-white shadow-lg rounded-xl">
            <span className="text-gray-700">{task.text}</span>
            <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 font-black hover:text-red-700 transition"
            >
                ✖
            </button>
            </li>
        ))}
        </ul>

      {/* ログアウトボタン */}
        <button
        onClick={handleLogout}
        className="w-full bg-red-400 text-white font-bold p-3 rounded-xl mt-6 hover:bg-red-500 transition-all"
        >
        🚪 ログアウト
        </button>
    </main>
    );
}



