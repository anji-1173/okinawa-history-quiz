import { fireEvent, render, screen, within, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => { cleanup(); window.location.hash = ''; vi.restoreAllMocks(); });

it('lets learners start released Satsuma courses but not the unfinished advanced course', () => {
  window.location.hash = '#journey';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  const card = screen.getByRole('heading', { name: '薩摩侵攻後の王国' }).closest('article')!;
  fireEvent.click(within(card).getByRole('button'));
  expect((screen.getByRole('button', { name: /中級編/ }) as HTMLButtonElement).disabled).toBe(false);
  expect((screen.getByRole('button', { name: /上級編/ }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: /初級編/ }));
  expect(screen.getByRole('button', { name: '1609年' })).toBeTruthy();
});
