module AutomationNodes
  module Conditions
    # Evaluates a Redmine Query Language (RQL) expression against the current issue.
    #
    # Expression form:
    #   {{token}} <operator> <value>
    #
    #   - The left operand is a {{token}} resolved via the token processor
    #     (issue fields, associations, custom fields), e.g. {{issue.status.id}}.
    #   - The right operand is a literal (or another {{token}}).
    #
    # Supported operators:
    #   =  ==   equality (string/numeric)
    #   !=      inequality
    #   >  >=  <  <=   numeric comparison
    #   contains   substring match
    #   in         right side is a comma-separated list, matches membership
    #
    # Examples:
    #   {{issue.status.id}} = 1
    #   {{issue.priority.id}} > 2
    #   {{issue.subject}} contains bug
    #   {{issue.project.status}} = 1
    class RedmineQueryLanguageService < ::AutomationService
      OPERATORS = ["!=", ">=", "<=", "==", "=", ">", "<", "contains", "in"].freeze

      def call
        return failure(message: node_message(:failure_config)) if node.query.blank?

        left, operator, right = parse_expression
        return failure(message: node_message(:failure_config)) unless left && operator

        evaluate(left, operator, right) ? success(message: node_message(:success)) : skipped(message: node_message(:skipped))
      end

      private

      def parse_expression
        operator = OPERATORS.find { |op| node.query.include?(op) }
        return [nil, nil, nil] unless operator

        left, right = node.query.split(operator, 2).map(&:strip)
        [left, operator, right]
      end

      def evaluate(left, operator, right)
        left_value = resolve_operand(left)
        right_value = resolve_operand(right)

        case operator
        when "=", "=="
          left_value.to_s == right_value.to_s
        when "!="
          left_value.to_s != right_value.to_s
        when ">"
          left_value.to_f > right_value.to_f
        when ">="
          left_value.to_f >= right_value.to_f
        when "<"
          left_value.to_f < right_value.to_f
        when "<="
          left_value.to_f <= right_value.to_f
        when "contains"
          left_value.to_s.include?(right_value.to_s)
        when "in"
          right_value.to_s.split(",").map(&:strip).include?(left_value.to_s)
        else
          false
        end
      end

      def resolve_operand(operand)
        operand = operand.to_s.strip
        if operand.start_with?("{{") && operand.end_with?("}}")
          resolve_token(operand[2..-3])
        else
          operand
        end
      end
    end
  end
end
