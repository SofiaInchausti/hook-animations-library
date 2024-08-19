# 📦 ReactHookToolbox #


A collection of custom React hooks designed to simplify common tasks in your React applications. This library provides utility hooks for handling HTTP requests, managing clipboard actions, responding to events, tracking focus, hover states, infinite scrolling, local storage management, online/offline status, and window resize events.

### ✨ Features ###
* useAxios: Simplify HTTP requests using Axios with built-in loading and error handling.
* useClipboard: Easily copy text to the clipboard and track the success of the operation.
* useEvent: Attach and manage event listeners with automatic cleanup.
* useFocus: Track and manage focus states of DOM elements.
* useHover: Detect when a user hovers over an element.
* useInfiniteScroll: Implement infinite scrolling by observing a sentinel element.
* useLocalStorage: Manage and persist state in local storage with ease.
* useOnlineStatus: Monitor the online/offline status of the user.
* useWindowResize: Track window resize events and react to changes in viewport size.

### 📚 Installation ###
Install the library using npm or yarn:
```bash
npm install react-hook-toolbox
```
or
```bash
yarn add react-hook-toolbox
```

### 🚀 Here's how you can start using the hooks in your project: ###

#### useAxios ####
```bash
import { useAxios } from 'react-hook-toolbox';

const { data, error, loading } = useAxios('/api/data');
```

#### useClipboard ####
```bash
import { useClipboard } from 'react-hook-toolbox';

const { copyToClipboard, isCopied } = useClipboard();
copyToClipboard('Hello, World!');
```

##### useEvent ####
```bash
import { useEvent } from 'react-hook-toolbox';

useEvent('scroll', handleScroll, window);
```

#### useFocus ####
```bash
import { useFocus } from 'react-hook-toolbox';

const { ref, isFocused } = useFocus();
```

#### useInfiniteScroll #####
```bash
import { useInfiniteScroll } from 'react-hook-toolbox';

const { sentinelRef, loadMore, hasMore } = useInfiniteScroll(loadMoreData);
```

#### useLocalStorage ####
```bash
import { useLocalStorage } from 'react-hook-toolbox';

const [value, setValue] = useLocalStorage('key', 'defaultValue');
```

#### useOnlineStatus ####
```bash
import { useOnlineStatus } from 'react-hook-toolbox';

const isOnline = useOnlineStatus();
```

### useWindowResize ####
```bash
import { useWindowResize } from 'react-hook-toolbox';

const { width, height } = useWindowResize();
```

### 🛠 Contributing ####
Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.
