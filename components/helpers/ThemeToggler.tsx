import { Button } from "@/shared/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

const style = "size-5 text-volen-800 dark:text-volen-200"

export default function ThemeToggler() {
    const { resolvedTheme, setTheme } = useTheme();
    return (
        <Button variant="ghost" size="default" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "light" ? <Sun className={style} /> : <Moon className={style} />}
        </Button>
    );
}