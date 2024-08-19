import { render, screen, fireEvent } from '@testing-library/react';
import useFocus from '../useFocus';

const TestComponent = () => {
  const [inputRef, setFocus] = useFocus();
  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Focus me" />
      <button onClick={setFocus}>Focus Input</button>
      <button>Other Button</button>
    </div>
  );
};

describe('useFocus', () => {
  test('should focus the input element when setFocus is called', () => {
    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Focus me') as HTMLInputElement;
    const button = screen.getByText('Focus Input');
    expect(document.activeElement).not.toBe(input);
    fireEvent.click(button);
    expect(document.activeElement).toBe(input);
  });
});
