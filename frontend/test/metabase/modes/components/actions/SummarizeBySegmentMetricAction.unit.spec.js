/* eslint-disable flowtype/require-valid-file-annotation */

import {
  SAMPLE_DATASET,
  ORDERS,
  metadata,
} from "__support__/sample_dataset_fixture";
import { click } from "__support__/enzyme_utils";
import Question from "metabase-lib/lib/Question";
import SummarizeBySegmentMetricAction from "metabase/modes/components/actions/SummarizeBySegmentMetricAction";
import { mount } from "enzyme";

const question = Question.create({
  databaseId: SAMPLE_DATASET.id,
  tableId: ORDERS.id,
  metadata,
});

describe("SummarizeBySegmentMetricAction", () => {
  describe("aggregation options", () => {
    it("should show only a subset of all query aggregations", () => {
      const hasAggregationOperator = (popover, optionName) =>
        popover.find(`.List-item-title[children="${optionName}"]`).length === 1;

      const action = SummarizeBySegmentMetricAction({ question })[0];
      const popover = mount(
        action.popover({
          onClose: () => {},
          onChangeCardAndRun: () => {},
        }),
      );

      expect(hasAggregationOperator(popover, "Count of rows")).toBe(true);
      expect(hasAggregationOperator(popover, "Average of ...")).toBe(true);
      expect(hasAggregationOperator(popover, "Raw data")).toBe(false);
      expect(hasAggregationOperator(popover, "Cumulative count of rows")).toBe(
        false,
      );
      expect(popover.find(".List-section-title").length).toBe(0);
    });
  });

  describe("onChangeCardAndRun", async () => {
    it("should be called for 'Count of rows' choice", async () => {
      const action = SummarizeBySegmentMetricAction({ question })[0];

      await new Promise((resolve, reject) => {
        const popover = action.popover({
          onClose: () => {},
          onChangeCardAndRun: async card => {
            expect(card).toBeDefined();
            resolve();
          },
        });

        const component = mount(popover);
        click(component.find('.List-item-title[children="Count of rows"]'));
      });
    });

    it("should be called for 'Sum of ...' => 'Subtotal' choice", async () => {
      const action = SummarizeBySegmentMetricAction({ question })[0];

      await new Promise((resolve, reject) => {
        const popover = action.popover({
          onClose: () => {},
          onChangeCardAndRun: async card => {
            expect(card).toBeDefined();
            resolve();
          },
        });

        const component = mount(popover);
        click(component.find('.List-item-title[children="Sum of ..."]'));

        click(component.find('.List-item-title[children="Subtotal"]'));
      });
    });
  });
});
