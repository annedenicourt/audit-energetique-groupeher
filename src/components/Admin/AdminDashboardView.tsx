import { Activity, Clock, FileText, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface Study {
  id: string;
  user_id: string;
  client_name: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
}

interface Props {
  studyCount: number;
  profileCount: number;
  recentStudies: Study[];
  profiles: Profile[];
}

const AdminDashboardView: React.FC<Props> = ({ studyCount, profileCount, recentStudies, profiles }) => {
  const profileMap = new Map(profiles.map((p) => [p.id, p.display_name ?? "Inconnu"]));

  const formatDateTime = (d: string) => {
    const date = new Date(d);
    return {
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de l'activité.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Études réalisées</p>
              <p className="text-2xl font-bold text-foreground">{studyCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Commerciaux</p>
              <p className="text-2xl font-bold text-foreground">{profileCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <Activity className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Statut</p>
              <p className="text-sm font-semibold text-foreground">Opérationnel</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernières études */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Dernières études</h2>
        {recentStudies.length === 0 ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]">
              <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucune étude pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {recentStudies.map((study) => {
              const { date, time } = formatDateTime(study.created_at);
              return (
                <Card key={study.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-foreground truncate text-sm">
                      {study.client_name || "Client non renseigné"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{date} à {time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profileMap.get(study.user_id) ?? "Inconnu"}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboardView;