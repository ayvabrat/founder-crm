"use client";
import Link from "next/link";
export function FAB(): React.JSX.Element { return <Link href="/contacts/new" className="fixed bottom-24 right-6 rounded-full bg-primary px-4 py-3 font-semibold text-white">+</Link>; }
