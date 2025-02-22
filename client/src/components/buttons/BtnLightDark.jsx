const BtnLightDark = () => {
  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem('theme') === 'dark'
  // );
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }, [darkMode]);
  return (
    <div>
      {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-full cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {darkMode ? '🌞' : '🌙'}
          </button> */}
    </div>
  );
};

export default BtnLightDark;
