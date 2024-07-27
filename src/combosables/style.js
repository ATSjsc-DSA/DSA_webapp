const colorArray = [
  '--blue-700',
  '--green-700',
  '--yellow-700',
  '--cyan-700',
  '--pink-700',
  '--indigo-700',
  '--teal-700',
  '--orange-700',
  '--red-700',
  '--purple-700',
  '--primary-700',
  '--blue-600',
  '--green-600',
  '--yellow-600',
  '--cyan-600',
  '--pink-600',
  '--indigo-600',
  '--teal-600',
  '--orange-600',
  '--red-600',
  '--purple-600',
  '--primary-600',
  '--blue-500',
  '--green-500',
  '--yellow-500',
  '--cyan-500',
  '--pink-500',
  '--indigo-500',
  '--teal-500',
  '--orange-500',
  '--red-500',
  '--purple-500',
  '--primary-500',
  '--blue-400',
  '--green-400',
  '--yellow-400',
  '--cyan-400',
  '--pink-400',
  '--indigo-400',
  '--teal-400',
  '--orange-400',
  '--red-400',
  '--purple-400',
  '--primary-400',
  '--blue-300',
  '--green-300',
  '--yellow-300',
  '--cyan-300',
  '--pink-300',
  '--indigo-300',
  '--teal-300',
  '--orange-300',
  '--red-300',
  '--purple-300',
  '--primary-300',
  '--blue-200',
  '--green-200',
  '--yellow-200',
  '--cyan-200',
  '--pink-200',
  '--indigo-200',
  '--teal-200',
  '--orange-200',
  '--red-200',
  '--purple-200',
  '--primary-200',
];
const styleLocal = () => {
  const getRandomColor = (colorsUsed) => {
    let attempts = 0;
    let currentIndex = 0;

    // Ensure we don't get stuck in an infinite loop
    while (attempts < colorArray.length) {
      currentIndex = (currentIndex + 1) % colorArray.length;
      if (!colorsUsed.includes(colorArray[currentIndex])) {
        break;
      }
      attempts++;
    }

    // If all colors are used, this will return undefined
    return colorArray[currentIndex];
  };
  return {
    getRandomColor,
  };
};

export default styleLocal;
