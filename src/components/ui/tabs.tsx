export function Tabs({ children }: { children: React.ReactNode }): React.JSX.Element { return <div>{children}</div>; }
export function TabsList({ children }: { children: React.ReactNode }): React.JSX.Element { return <div className="grid grid-cols-3 gap-2">{children}</div>; }
export function TabsTrigger({ children }: { children: React.ReactNode; value: string }): React.JSX.Element { return <button className="rounded border border-zinc-700 px-2 py-1 text-xs">{children}</button>; }
export function TabsContent({ children }: { children: React.ReactNode; value: string }): React.JSX.Element { return <div>{children}</div>; }
