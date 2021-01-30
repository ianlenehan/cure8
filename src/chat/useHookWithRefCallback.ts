import { useRef, useCallback } from 'react';

function useHookWithRefCallback() {
  const ref = useRef(null);
  const setRef = useCallback(node => {
    if (ref.current) {
      console.log('current?', ref.current);
      ref.current.scrollToLocation({
        animated: true,
        sectionIndex: 3,
        itemIndex: 0,
        viewPosition: 0
      });
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      console.log('useHookWithRefCallback -> node', node);
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [ref, setRef];
}

export default useHookWithRefCallback;
