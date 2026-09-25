import { fireEvent, render, screen, within, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => { cleanup(); window.location.hash = ''; vi.restoreAllMocks(); });

it('opens reversion beginner with all courses available', () => {
  window.location.hash = '#journey';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  const card = screen.getByRole('heading', { name: '日本復帰と制度転換' }).closest('article')!;
  fireEvent.click(within(card).getByRole('button'));
  expect((screen.getByRole('button', { name: /中級編/ }) as HTMLButtonElement).disabled).toBe(false);
  expect((screen.getByRole('button', { name: /上級編/ }) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: /初級編/ }));
  expect(screen.getByRole('button', { name: '1972年5月15日' })).toBeTruthy();
});

it('shows thirty released questions on the reversion home card', () => {
  window.location.hash = '';
  render(<App />);
  const card = screen.getByRole('heading', { name: '日本復帰と制度転換' }).closest('article')!;
  expect(within(card).getByText('30問 公開中')).toBeTruthy();
});

it.each([
  ['中級編', '高等弁務官が立法や予算を覆す権限を持ったため'],
  ['上級編', '住民側の政府機構と米国側の優越的権限が併存した'],
])('opens the US administration %s course', (course, answer) => {
  window.location.hash = '#journey';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  const card = screen.getByRole('heading', { name: '米国統治と琉球政府' }).closest('article')!;
  fireEvent.click(within(card).getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(course) }));
  expect(screen.getByRole('button', { name: answer })).toBeTruthy();
});

it('shows the actual number of released questions for a partially released era', () => {
  window.location.hash = '';
  render(<App />);
  const card = screen.getByRole('heading', { name: '戦後の再出発' }).closest('article')!;
  expect(within(card).getByText('30問 公開中')).toBeTruthy();
});

it('lets learners start every released Satsuma course', () => {
  window.location.hash = '#journey';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  const card = screen.getByRole('heading', { name: '薩摩侵攻後の王国' }).closest('article')!;
  fireEvent.click(within(card).getByRole('button'));
  expect((screen.getByRole('button', { name: /中級編/ }) as HTMLButtonElement).disabled).toBe(false);
  expect((screen.getByRole('button', { name: /上級編/ }) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: /初級編/ }));
  expect(screen.getByRole('button', { name: '1609年' })).toBeTruthy();
});

it('opens the postwar advanced course', () => {
  window.location.hash = '#journey';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  const card = screen.getByRole('heading', { name: '戦後の再出発' }).closest('article')!;
  fireEvent.click(within(card).getByRole('button'));
  expect((screen.getByRole('button', { name: /中級編/ }) as HTMLButtonElement).disabled).toBe(false);
  expect((screen.getByRole('button', { name: /上級編/ }) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: /上級編/ }));
  expect(screen.getByRole('button', { name: '政府の組織と、その権限への制約を併せて捉える' })).toBeTruthy();
});
