import Link from "next/link";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";

import { LogoMark } from "../ui/logo-mark";

const product = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Databases", href: "#databases" },
  { name: "Roadmap", href: "#" }
];

const resources = [
  { name: "Documentation", href: "/docs" },
  { name: "GitHub", href: "https://github.com/shaqibraza/QueryFlow" },
  { name: "API", href: "#" }
];

const company = [
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Privacy", href: "#" },
  { name: "Terms", href: "#" }
];

export function Footer() {
  return (
    <footer className="relative mt-2 border-t border-white/10 bg-[#09090B]">
      {/* Footer */}

      <div className="mx-auto mt-24 max-w-7xl px-5 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                <LogoMark size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-white">QueryFlow</h3>

                <p className="text-xs text-zinc-500">AI Database Workspace</p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-zinc-400">
              Transform natural language into production-ready database queries for PostgreSQL,
              MySQL and MongoDB.
            </p>
          </div>

          {/* Product */}

          <div>
            <h4 className="font-medium text-white">Product</h4>

            <div className="mt-5 flex flex-col gap-3">
              {product.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  {item.name}

                  <IconArrowUpRight
                    size={14}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}

          <div>
            <h4 className="font-medium text-white">Resources</h4>

            <div className="mt-5 flex flex-col gap-3">
              {resources.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  {item.name}

                  {item.name === "GitHub" ? (
                    <IconBrandGithub size={15} />
                  ) : (
                    <IconArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}

          <div>
            <h4 className="font-medium text-white">Company</h4>

            <div className="mt-5 flex flex-col gap-3">
              {company.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  {item.name}

                  <IconArrowUpRight
                    size={14}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} QueryFlow. All rights reserved.</p>

          <p>Built for developers. Powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
