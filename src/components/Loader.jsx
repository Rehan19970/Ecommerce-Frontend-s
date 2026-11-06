const Loader = ({ fullScreen = false }) => {
  const loader = (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-light-grey border-t-gold rounded-full animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;