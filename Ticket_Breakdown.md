# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

**Assumptions**
I am assuming in the current setup, there is a 1 x N relationship between Agents and Shifts. Additionally, I am assuming there is a N x 1 relationship between Shifts and Facilities. Finally, I assume there is no formal way (IE join table) to join between Agents & Facilities (unless going through the `Shifts` table).

1. Create a `FacilityAgents` table which will be a N x N join table between Facilities and Agents. In addition to any default columns, This table should have an `facility_agent_id` (primary key), `agent_id` (foreign key to `Agents`), `facility_id` (foreign key to `Facilities`) and `report_id` (nullable custom ID that the facilities use as the custom id for this agent). This table should have additional unique indexes added on (`facility_id`, `report_id`) and (`facility_id`, `agent_id`). The first of these indexes is to ensure that facilities don't assign the same `report_id` to multiple agents and the second is to ensure that the same agent isn't enrolled in the same facility multiple times. Additionally, we will need to run migrations on the `Shifts` table, which currently joins `Agents` and `Facilities` via foreign keys to both. This can be done by going through each row in `Shifts`, and creating a new corresponding entry in `FacilityAgents` using the Agent's and Facility's ID (which should exist foreign keys).
2. Update the logic for enrolling an Agent to a new facility to also create an entry in our newly created `FacilityAgents` table. On initial entry creation, `report_id` should initially be set to null.
3. Create new function `setAgentReportIDForFacility(facilityID: int, agentID: int, reportID: int)` which will update the `report_id` field on the `FacilityAgents` row that has `facility_id` and `agent_id` fields that match our first two parameters respectively.
4. Update `getShiftsByFacility` to fetch the Agent through a join on the `FacilityAgents` table, and include the `report_id` in the return type of `getShiftsByFacility`.
5. Update `generateReport` to fetch the Agent through a join on the `FacilityAgents` table. Additionally, the part of `generateReport` which passes in data to the pdf-generating function should pass the `report_id` in place of the `agent_id`.
6. (Follow-up) Once all the above are completed and after sometime has passed where you know you won't need to rollback, `Shifts` should be migrated to join on `FacilityAgents`, as we shouldn't have two seperate join tables between `Facility` and `Agents`. This can be done in two steps by first adding a new foreign key field which references `FacilityAgents` and then once fully migrated, dropping the existing foreign key fields which reference `Facilities` and `Agents`.

**Additional Context**
The reason we are making `FacilityAgents` to be our core join table instead of `Shifts` is because there can be multiple shifts per agent at a facility which means we wouldn't have a single place to add an agent's `report_id`. Even if we put `report_id` as a new field on Shifts and have some sort of unique constraint on it, a facility setting a new `report_id` would require us to update it on every single `Shifts` entry that the agent has worked. By creating this new join table, we have a single source of updates for `report_id`, a formal join table between `Agents` and `Facilities` and we can still very easily join to `Shifts`.
