import AddAllNews from "@/components/admin/AddAllNews/AddAllNews";
import GetStatusBot from "@/components/admin/GetStatusBot/GetStatusBot";
import SetAddress from "@/components/admin/SetAddress/SetAddress";
import AddAllContact from "@/components/admin/AddAllContact/AddAllContact";
import AddAllAppeals from "@/components/admin/addAllApeals/AddAllAppeals";

export default function AdminPanelPage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1>Admin Panel</h1>
            <GetStatusBot />
            <SetAddress />
            <AddAllNews />
            <AddAllContact />
            <AddAllAppeals />
        </div>
    )
}