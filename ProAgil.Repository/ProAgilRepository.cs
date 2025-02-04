using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository 
{
    public class ProAgilRepository : IProAgilRepository 
    {
        private readonly ProAgilContext _context;
        public ProAgilRepository (ProAgilContext context) 
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        //GERAIS
        public void Add<T>(T entity) where T : class 
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class 
        {
            _context.Update(entity);
        }
        public void Delete<T>(T entity) where T : class 
        {
            _context.Remove(entity);
        }
        public void DeleteRange<T>(T[] entityArray) where T : class 
        {
            _context.RemoveRange(entityArray);
        }
        public async Task<bool> SaveChangesAsync() 
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        // Evento
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes) 
        {
            IQueryable<Evento> query = _context.Eventos
                .Include (c => c.Lotes)
                .Include (c => c.RedesSociais);

            if (includePalestrantes == true) {
                query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                .OrderBy (c => c.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes) 
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if (includePalestrantes) 
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                .Where(e => e.Tema.ToLower().Contains(tema.ToLower()))
                .OrderByDescending(c => c.DataEvento);
                

            return await query.ToArrayAsync ();
        }

        public async Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes) 
        {
            IQueryable<Evento> query = _context.Eventos
                .Include (c => c.Lotes)
                .Include (c => c.RedesSociais);

            if (includePalestrantes) 
            {
                query = query
                    .Include (pe => pe.PalestrantesEventos)
                    .ThenInclude (p => p.Palestrante);
            }

            query = query
                .AsNoTracking()                
                .Where (c => c.Id == EventoId)
                .OrderBy (c => c.Id);

            return await query.FirstOrDefaultAsync();
        }

        //PALESTRANTE
        public async Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include (c => c.RedesSociais);

            if (includeEventos) 
            {
                query = query
                    .Include (pe => pe.PalestrantesEventos)
                    .ThenInclude (e => e.Evento);
            }

            query = query.AsNoTracking()                
                .Where (p => p.Id == PalestranteId)
                .OrderBy (p => p.Nome);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName (string name, bool includeEventos = false) 
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include (c => c.RedesSociais);

            if (includeEventos) {
                query = query
                    .Include (pe => pe.PalestrantesEventos)
                    .ThenInclude (e => e.Evento);
            }

            query = query.AsNoTracking()
                .Where (p => p.Nome.ToLower().Contains(name.ToLower()));

            return await query.ToArrayAsync ();
        }

    }
}