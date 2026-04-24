const Main = ({ children }) => {
  return (
    <main className="flex-1">
      <div className="min-h-[calc(100vh-48px)]">
        {children}
      </div>
    </main>
  );
};

export default Main;