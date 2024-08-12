import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import useFocus from '../useFocus';

// Componente de prueba
const TestComponent = () => {
  const [inputRef, setFocus] = useFocus<HTMLInputElement>();

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Focus me" />
      <button onClick={setFocus}>Focus Input</button>
      <button>Other Button</button>
    </div>
  );
};

// Tests
describe('useFocus', () => {
  test('should focus the input element when setFocus is called', () => {
    render(<TestComponent />);

    const input = screen.getByPlaceholderText('Focus me') as HTMLInputElement;
    const button = screen.getByText('Focus Input');

    // Verifica que el input no esté enfocado inicialmente
    expect(document.activeElement).not.toBe(input);

    // Simula el clic en el botón para enfocar el input
    fireEvent.click(button);

    // Verifica que el input esté enfocado
    expect(document.activeElement).toBe(input);
  });

});
