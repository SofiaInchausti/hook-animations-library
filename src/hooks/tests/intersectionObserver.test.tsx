/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useState } from "react";
import useInfiniteScroll from "../useInfiniteScroll";
import "../../../tests/setup";

interface TestComponentProps {
  hasMore?: boolean;
  loadMore?: () => void;
  loading?: boolean;
  threshold?: number;
  root?: Element
}

const TestComponent: React.FC<TestComponentProps> = ({
  hasMore = true,
  loadMore = () => {},
  loading = false,
  threshold = 0.1,
  root = null
}) => {
  const [items, setItems] = useState<string[]>([]);

  const loadMoreHandler = () => {
    setItems((prevItems) => [...prevItems, "New Item"]);
    if (loadMore) loadMore();
  };

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    loadMore: loadMoreHandler,
    loading,
    root: root,
    rootMargin: "0px",
    threshold: threshold,
  });

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      <div ref={sentinelRef} style={{ height: "1px", visibility: "hidden" }} />
    </div>
  );
};

describe("useInfiniteScroll", () => {
  beforeAll(() => {
    // IntersectionObserver Mock
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        return {
          observe: () => {
            // Simulate the intersection after the delay
            setTimeout(() => {
              callback([{ isIntersecting: true }] as any, {} as any);
            }, 100);
          },
          unobserve: () => null,
          disconnect: () => null,
        };
      }
    );

    window.IntersectionObserver = mockIntersectionObserver;
  });

  test("should call loadMore when sentinel is intersecting", async () => {
    const loadMore = vi.fn();

    render(<TestComponent loadMore={loadMore} />);

    await waitFor(() => {
      expect(loadMore).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("New Item")).toBeInTheDocument();
    });
  });

  test("should not call loadMore when hasMore is false", async () => {
    const loadMore = vi.fn();

    render(<TestComponent hasMore={false} loadMore={loadMore} />);

    expect(screen.queryByText("New Item")).not.toBeInTheDocument();

    await waitFor(() => expect(loadMore).not.toHaveBeenCalled());
  });

  test("should not call loadMore when loading is true", async () => {
    const loadMore = vi.fn(); 
    render(<TestComponent loadMore={loadMore} loading={true} />);
    await waitFor(() => expect(loadMore).not.toHaveBeenCalled());
  });

  test("should handle different thresholds correctly", async () => {
    const loadMore = vi.fn();
    render(<TestComponent loadMore={loadMore} threshold={0.5} />);
    await waitFor(() => {
      expect(loadMore).toHaveBeenCalled();
    });
  });

  test("should unobserve when the component unmounts", async () => {
    const mockUnobserve = vi.fn();
    
    const mockIntersectionObserver = vi.fn().mockImplementation(
      () => {
        return {
          observe: vi.fn(),
          unobserve: mockUnobserve,
          disconnect: vi.fn(),
        };
      }
    );
  
    window.IntersectionObserver = mockIntersectionObserver;
  
    const { unmount } = render(<TestComponent />);
  
    unmount();
  
    expect(mockUnobserve).toHaveBeenCalled();
  });

  test("should not call loadMore when hasMore is false, even on multiple intersections", async () => {
    const loadMore = vi.fn();
    render(<TestComponent hasMore={false} loadMore={loadMore} />);
    await waitFor(() => expect(loadMore).not.toHaveBeenCalled());
    for (let i = 0; i < 3; i++) {
      await waitFor(() => expect(loadMore).not.toHaveBeenCalled());
    }
  });
});
