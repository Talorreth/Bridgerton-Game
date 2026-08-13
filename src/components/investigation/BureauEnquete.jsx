import Header from '../layout/Header'
import CluesList from './CluesList'
import DeductionGrid from './DeductionGrid'

export default function BureauEnquete({
  unlockedClues,
  deductionGrid,
  setDeductionCell,
  mysterySolved,
  solveMystery,
  lastChanceUsed,
  triggerLastChance,
}) {
  return (
    <div className="pb-28">
      <Header
        eyebrow="Bureau d'enquête"
        title="Le Secret de Lady Whistledown"
        subtitle="Rassemblez les feuillets, croisez les indices, démasquez le coupable."
      />

      <div className="mx-6 mb-8">
        <h3 className="mb-3 font-display text-base font-semibold text-ink">Feuillets révélés</h3>
        <CluesList clues={unlockedClues} />
      </div>

      <div className="mx-6">
        <DeductionGrid
          deductionGrid={deductionGrid}
          setDeductionCell={setDeductionCell}
          mysterySolved={mysterySolved}
          solveMystery={solveMystery}
          lastChanceUsed={lastChanceUsed}
          triggerLastChance={triggerLastChance}
        />
      </div>
    </div>
  )
}
