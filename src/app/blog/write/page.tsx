import MainLayout from "@/components/layouts/MainLayout";
import TailwindEditor from "@/components/text-editor/text-editor";

export default function Page() {
  return (
    <MainLayout>
      <div spellCheck={false} className="pb-9">
        <TailwindEditor autoFocus />
      </div>
    </MainLayout>
  );
}
