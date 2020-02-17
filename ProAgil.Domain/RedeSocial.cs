namespace ProAgil.Domain
{
    public class RedeSocial
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string URL { get; set; }    
        public int? EventoId { get; set; }   // fk
        public Evento Evento { get; }
        public int? PalestranteId { get; set; } // fk
        public Palestrante Palestrante { get; }
    }
}