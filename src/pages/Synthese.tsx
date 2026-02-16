import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutList, LayoutGrid, FileText, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import StepSynthese from "@/components/steps/StepSynthese";
import { FormData, initialFormData } from "@/types/formData";


const Synthese: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const STORAGE_KEY = "simulation_form";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Retour Simulateur
        </button>
      </div>
      <StepSynthese data={formData} />
    </div>
  );
};

export default Synthese;
