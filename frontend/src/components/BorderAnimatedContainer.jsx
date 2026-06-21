function BorderAnimatedContainer({ children }) {
  return (
   <div className="w-full h-full [background:linear-gradient(45deg,#111827,theme(colors.green.950)_90%,#123125)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.green.800/.48)_80%,_theme(colors.emerald.500)_86%,_theme(colors.green.300)_90%,_theme(colors.emerald.500)_94%,_theme(colors.green.800/.48))_border-box] rounded-2xl border border-transparent animate-border flex overflow-hidden">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;