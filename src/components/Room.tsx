'use client';

import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoomProvider, VotingState } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { Layer } from '@/lib/types';
import { Loading } from '@/components/Loading';
import Canvas from '@/components/Canvas/Canvas';
import { steps } from '@/lib/process-data';
import { SerializableNode } from '@/lib/types';
interface RoomProps {
  roomId: string;
}
const Room = ({ roomId }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
        currentProcess: 1,
      }}
      initialStorage={{
        time: new LiveObject({ time: 300 }),
        process: new LiveList(steps),
        groupCall: new LiveObject({
          roomId: '',
          activeUsers: new LiveList([]),
        }),
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
        person: new LiveObject({ name: 'Marie', age: 30 }),
        nodes: new LiveMap<string, LiveObject<SerializableNode>>(),
        edges: [], //이거 중요함 수정 x
        host: new LiveObject({ userId: '' }), // 호스트 정보
        voting: new LiveObject({
          votes: {},
          currentStep: 1,
          isCompleted: false,
          showCompletionModal: false,
        }),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Canvas />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
