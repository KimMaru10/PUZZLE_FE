import { Color } from '@/lib/types';

export interface VisionBoxProps {
  id: string;
  position: { x: number; y: number };
  color: Color;
}