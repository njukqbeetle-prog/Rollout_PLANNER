import { WeekData, ScheduleRow, LegendItem } from '../types';
import { COLORS } from '../constants';

// Helper to create an empty week array
const createEmptyWeek = (): (null | any)[] => Array(6).fill(null);

export const generateSchedule = (numBranches: number): WeekData[] => {
  const weeks: WeekData[] = [];
  
  // We process branches in pairs (batches).
  // Batch 1: Branch 1 & 2
  // Batch 2: Branch 3 & 4
  // ...
  const totalBatches = Math.ceil(numBranches / 2);
  // Total weeks needed is usually Batches + 1 because the last batch needs a week for handover.
  const totalWeeks = totalBatches + 1;

  for (let w = 1; w <= totalWeeks; w++) {
    const isFirstWeek = w === 1;
    const isLastWeek = w === totalWeeks;
    
    // Determine which branches are being physically installed this week
    // Week 1 installs Batch 1 (Br 1 & 2)
    // Week 2 installs Batch 2 (Br 3 & 4)
    // Week k installs Batch k
    const currentBatchIndex = w; 
    const installBranches: number[] = [];
    if (currentBatchIndex <= totalBatches) {
      const startB = (currentBatchIndex - 1) * 2 + 1;
      if (startB <= numBranches) installBranches.push(startB);
      if (startB + 1 <= numBranches) installBranches.push(startB + 1);
    }

    // Determine which branches are being finalized (Training -> Handover)
    // This happens for the PREVIOUS batch.
    // Week 2 finalizes Batch 1.
    // Week 3 finalizes Batch 2.
    const finalizeBatchIndex = w - 1;
    const finalizeBranches: number[] = [];
    if (finalizeBatchIndex >= 1 && finalizeBatchIndex <= totalBatches) {
      const startB = (finalizeBatchIndex - 1) * 2 + 1;
      if (startB <= numBranches) finalizeBranches.push(startB);
      if (startB + 1 <= numBranches) finalizeBranches.push(startB + 1);
    }

    // --- CONSTRUCT ROWS ---
    const rows: ScheduleRow[] = [];
    const legends: LegendItem[] = [];

    // 1. Physical Installation (If we have install branches)
    if (installBranches.length > 0) {
      const row: ScheduleRow = { activity: 'Physical Installation', cells: createEmptyWeek() };
      
      // Branch A (Odd): Days 1-3 (Week 2+) or Days 1-2 (Week 1)
      if (installBranches.length > 0) {
        const days = isFirstWeek ? 2 : 3;
        for(let i=0; i<days; i++) row.cells[i] = { backgroundColor: COLORS.PHYSICAL_1 };
        legends.push({ color: COLORS.PHYSICAL_1, label: `Physical installation for Branch ${installBranches[0]}` });
      }
      
      // Branch B (Even): Days 4-6
      if (installBranches.length > 1) {
        // Week 1: Starts Day 4 (Index 3). Week 2+: Starts Day 4 (Index 3).
        for(let i=3; i<6; i++) row.cells[i] = { backgroundColor: COLORS.PHYSICAL_2 };
        legends.push({ color: COLORS.PHYSICAL_2, label: `Physical installation for Branch ${installBranches[1]}` });
      }
      rows.push(row);
    }

    // 2. Software Installation (Week 1 Only)
    if (isFirstWeek) {
      const row: ScheduleRow = { activity: 'Software Installation', cells: createEmptyWeek() };
      // Days 1-2
      for(let i=0; i<2; i++) row.cells[i] = { backgroundColor: COLORS.SOFTWARE };
      rows.push(row);
      legends.push({ color: COLORS.SOFTWARE, label: 'Software installation for both QSYS & CX on client server' });
    }

    // 3. Training & Testing
    if (isFirstWeek) {
      // HQ Team Training - Day 3 (Index 2)
      const row: ScheduleRow = { activity: 'Training & Testing', cells: createEmptyWeek() };
      row.cells[2] = { backgroundColor: COLORS.TRAINING };
      rows.push(row);
      legends.push({ color: COLORS.TRAINING, label: 'Testing and training the HQ team' });
    } else if (finalizeBranches.length > 0) {
      // Previous Batch Training - Day 1-2
      const row: ScheduleRow = { activity: 'Training & Testing', cells: createEmptyWeek() };
      for(let i=0; i<2; i++) row.cells[i] = { backgroundColor: COLORS.TRAINING };
      rows.push(row);
      const bStr = finalizeBranches.join(' & ');
      legends.push({ color: COLORS.TRAINING, label: `Training & testing for branch ${bStr}` });
    }

    // 4. Dry Run
    if (isFirstWeek) {
      // HQ Dry Run - Day 4 (Index 3)
      const row: ScheduleRow = { activity: 'Dry run', cells: createEmptyWeek() };
      row.cells[3] = { backgroundColor: COLORS.DRY_RUN_HQ };
      rows.push(row);
      legends.push({ color: COLORS.DRY_RUN_HQ, label: 'Dry run the system' });
    } else if (finalizeBranches.length > 0) {
      // Prev Batch Dry Run - Day 1 (Index 0) - Blue color in Week 2+
      const row: ScheduleRow = { activity: 'Dry run', cells: createEmptyWeek() };
      row.cells[0] = { backgroundColor: COLORS.DRY_RUN_STD };
      rows.push(row);
      const bStr = finalizeBranches.join(' & ');
      legends.push({ color: COLORS.DRY_RUN_STD, label: `Dry run the system for branch ${bStr}` });
    }

    // 5. Go Live (Week 2+)
    if (!isFirstWeek && finalizeBranches.length > 0) {
      const row: ScheduleRow = { activity: 'Go live', cells: createEmptyWeek() };
      // Day 2 (Index 1) - Dark Red
      row.cells[1] = { backgroundColor: COLORS.GO_LIVE };
      rows.push(row);
      const bStr = finalizeBranches.join(' & ');
      legends.push({ color: COLORS.GO_LIVE, label: `Go live for branch ${bStr}` });
    }

    // 6. Monitoring (Week 2+)
    if (!isFirstWeek && finalizeBranches.length > 0) {
      const row: ScheduleRow = { activity: 'Monitoring', cells: createEmptyWeek() };
      // Days 2-6 (Index 1 to 5)
      for(let i=1; i<6; i++) row.cells[i] = { backgroundColor: COLORS.MONITORING };
      rows.push(row);
      const bStr = finalizeBranches.join(' & ');
      legends.push({ color: COLORS.MONITORING, label: `Monitoring for branch ${bStr}` });
    }

    // 7. Handover (Week 2+)
    if (!isFirstWeek && finalizeBranches.length > 0) {
      const row: ScheduleRow = { activity: 'Handover', cells: createEmptyWeek() };
      // Days 5-6 (Index 4 to 5)
      for(let i=4; i<6; i++) row.cells[i] = { backgroundColor: COLORS.HANDOVER };
      rows.push(row);
      const bStr = finalizeBranches.join(' & ');
      legends.push({ color: COLORS.HANDOVER, label: `System handover for branch ${bStr}` });
    }

    // --- BUILD TITLE ---
    let titleStr = `WEEK ${w} `;
    
    // Check if HQ is involved (Week 1 only usually)
    const hasHQ = isFirstWeek;
    
    // Combine all branch numbers involved in this week
    const allBranchNums = [...finalizeBranches, ...installBranches].sort((a,b) => a-b);
    
    if (allBranchNums.length === 0) {
        if (hasHQ) titleStr += "HQ";
    } else {
        // Format branch numbers: "1, 2, 3 & 4"
        let branchPart = "";
        if (allBranchNums.length === 1) {
            branchPart = allBranchNums[0].toString();
        } else {
            const last = allBranchNums.pop();
            branchPart = allBranchNums.join(',') + ' & ' + last; // Using comma without space for PDF tightness or ', '
        }
        
        if (hasHQ) {
             titleStr += `HQ, BRANCH ${branchPart}`;
        } else {
             titleStr += `BRANCH ${branchPart}`;
        }
    }

    weeks.push({
      weekNumber: w,
      title: titleStr,
      branchesInvolved: [...finalizeBranches, ...installBranches],
      rows,
      legends
    });
  }

  return weeks;
};