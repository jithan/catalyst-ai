import { generateData } from '../data/mockData';
import type { AppData } from '../types';

export async function fetchAppData(): Promise<AppData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateData());
    }, 250);
  });
}
