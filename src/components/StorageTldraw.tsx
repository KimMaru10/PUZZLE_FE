"use client";

import "tldraw/tldraw.css";
import { Tldraw, TLComponents, useEditor, track } from "tldraw";
import { useStorageStore } from "./useStorageStore";
import { useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from 'react';
import { Avatars } from "./Avatars";
import { Badge } from "./Badge";

const TopMenu = () => (
  <div>
    <div className="flex justify-between p-2">
      <div className="ml-3">puzzle</div>
      <div>제목을 입력하세요</div>
      <div className="mr-3">닫기</div>
    </div>

    <div className="flex justify-between items-center p-2 bg-white shadow-md">
      <div className="flex space-x-2 flex-grow">
        {['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '🔚'].map((icon, index) => (
          <button key={index} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full text-xl">
            {icon}
          </button>
        ))}
        <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-md text-2xl">
          +
        </button>
      </div>
      <div>
        <Avatars />
      </div>
    </div>

    <div className="text-start py-4 bg-gray-100">
      <h2 className="text-xl font-bold ml-3">1.펜도구 텍스트를 이용하여 자신을 표현하세요</h2>
    </div>

  </div>
);

const DownMenu = () => (
  <div 
    className="
      absolute bottom-4 left-1/2 transform -translate-x-1/2 
      bg-blue-500 hover:bg-blue-600 
      text-white
      rounded-full shadow-md px-6 py-3 
      flex items-center space-x-2
      cursor-pointer
      transition-colors duration-200
    "
  >
    <span className="text-lg">🧩</span>
    <span className="text-lg font-semibold">puzzle</span>
  </div>
);


const LeftSidebar = track(() => {
  const editor = useEditor();
  const tools = [
    { name: 'select', icon: '👋' },
    { name: 'draw', icon: '✏️' },
    { name: 'eraser', icon: '🔫' },
    { name: 'text', icon: '❌' },
    { name: 'ellipse', icon: '❌' },
    { name: 'rectangle', icon: '❌' },
    { name: 'frame', icon: '❌' },
    { name: 'undo', icon: '❌' },
    { name: 'redo', icon: '❌' },
  ];

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
      {tools.map(({ name, icon }) => (
        <button
          key={name}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${editor.getCurrentToolId() === name ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          onClick={() => editor.setCurrentTool(name)}
          title={name.charAt(0).toUpperCase() + name.slice(1)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
});

const RightSidebar = () => {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && time > 0) {
      interval = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
      <div className="text-2xl font-bold">{`${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`}</div>
      <button onClick={togglePlay} className="p-2 bg-blue-500 text-white rounded-full">
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
        🎵
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['🦆', '🔔', '👏', '📢', '🎺', '🥁'].map((effect, index) => (
          <button key={index} className="p-2 bg-gray-100 text-sm rounded">
            {effect}
          </button>
        ))}
      </div>
    </div>
  );
};

export function StorageTldraw() {
  const id = useSelf((me) => me.id);
  const info = useSelf((me) => me.info);

  const store = useStorageStore({
    user: { id, color: info.color, name: info.name },
  });

  const components: TLComponents = {
    Toolbar: () => null, // Hide default toolbar
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <TopMenu />
      <div className="flex-1 relative">
        <Tldraw
          store={store}
          components={components}
          autoFocus
          hideUi
        >
          <LeftSidebar />
          <RightSidebar />
          <DownMenu />
        </Tldraw>
      </div>

    </div>
  );
}