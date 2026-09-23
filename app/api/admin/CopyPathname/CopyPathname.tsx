import { useToast } from "@/shared/ui/components/toast"

export default function CopyPathname() {
    const {showToast} = useToast()
    return (
        <div>
            <button className="bg-primary text-white px-4 py-2 rounded-md" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Pathname copied to clipboard', 'success')
            }}>Copy Pathname</button>
        </div>
    )
}   