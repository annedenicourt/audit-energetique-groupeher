import React from "react";

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Admin OK</h1>
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          Liste des études (à venir)
        </div>
      </div>
    </div>
  );
};

export default Admin;
