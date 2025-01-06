import { useEffect, useState } from "react";
import openai from "./lib/openai";
import Markdown from 'react-markdown';

const prompt = `
あなたは優秀なベテラン就活アドバイザーです。以下の条件に従いながら、質問に回答してください。
今から渡される文章の
・問題点の指摘
・問題点を修正して、PASONA法を用いて文章を訂正する。(文章の文字数も表示する)
・修正点の説明
をそれぞれmarkdown形式かつ、タイトル部分を＃＃＃で出力するようにしてください。
問題点の修正点や指摘の説明は、就活生にわかりやすいように説明してください。
`;



function App() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [industry, setIndustry] = useState('');


  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const review = async () => {
    setIsLoading(true)
    const messages = [
      {
        role: 'user',
        content: prompt + `志望業界: ${industry}` + content
      },
    ];
    const result = await openai.completion(messages);
    setResult(result);
    if (!content.trim()) {
      alert('入力内容が空です。文章を入力してください。');
      return;
    }
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-900">エントリーシート添削(自己PR、長所短所、ガクチカなんでも聞いてみよう)</h1>
      </header>
      <div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mb-4 border p-2 rounded"
        >
          <option value="">志望業界を選択してください</option>
          <option value="IT">IT業界</option>
          <option value="製造">製造業</option>
          <option value="金融">金融業界</option>
          <option value="サービス">サービス業</option>
          <option value="サービス">メーカー</option>
          <option value="サービス">広告、出版、マスコミ</option>
          <option value="サービス">食品</option>
          <option value="サービス">不動産</option>
        </select>
      </div>
      <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <div className="flex flex-col w-1/2 h-full bg-gray-900 overflow-y-auto">
          <div className="flex-1 p-4 text-white">
            <textarea
              onChange={
                (e) => {
                  setContent(e.target.value);
                }}
              className="h-full w-full bg-transparent text-white resize-none outline-none" />
          </div>
          <button
            onClick={review}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'レビュー中...' : 'レビューする'}
          </button>
          <div className="text-white">文字数: {charCount}</div>
        </div>
        <div className="flex flex-col w-1/2 h-full items-center justify-center">
          <div className="p-4 overflow-y-auto w-full">{isLoading ? ('レビュー中') : (<Markdown className="markdown">{result}</Markdown>)}</div>
        </div>
      </main>

    </div>
  );
}

export default App;