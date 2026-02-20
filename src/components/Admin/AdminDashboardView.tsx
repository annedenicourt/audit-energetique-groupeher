import { Activity, FileText, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const AdminDashboardView: React.FC<{ studyCount: number; profileCount: number }> = ({ studyCount, profileCount }) => (
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
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[160px]">
        <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Graphiques & statistiques — à venir</p>
      </CardContent>
    </Card>
  </div>
);
export default AdminDashboardView;