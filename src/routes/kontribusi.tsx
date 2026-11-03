import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Users } from "~/components/ui/icons";

export const Route = createFileRoute("/kontribusi")({
  component: KontribusiPage,
});

function KontribusiPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Kontribusi"
        title="Informasi Pengembang"
        description="Proyek ini dikembangkan dan dikelola secara independen."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Users className="h-5 w-5 text-[var(--color-accent)]" />
            <CardTitle className="text-base">Tentang Pengembang</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)]">
            <CardDescription>
              Isi bagian ini dengan nama, kontak, dan kanal resmi Anda sebagai pengembang/pengelola proyek — misalnya
              email, akun GitHub, atau media sosial yang ingin ditampilkan ke publik.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Melaporkan Masalah</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)]">
            Jika Anda menemukan bug, celah keamanan, atau ketidaksesuaian antara tampilan dan status backend yang
            sebenarnya, silakan laporkan melalui kanal kontak yang dicantumkan di atas.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
